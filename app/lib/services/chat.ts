'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import User from '@/app/lib/models/User';
import { Chat } from '../types/chat';
import { mongooseConnect } from '../mongoose';
import ChatModel from '../models/Chat';
import { getMe } from '../actions';

export async function getChats(userId?: string | null) {
  await mongooseConnect();

  if (!userId) {
    return [];
  }
  try {
    const chats = await ChatModel.find({});

    return chats as Chat[];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string, userId: string) {
  await mongooseConnect();
  const chat = await ChatModel.findOne({ id });
  if (!chat || (userId && chat.userId !== userId)) {
    return null;
  }

  return chat as Chat;
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  await mongooseConnect();
  const res = await getMe();

  if (res.error) {
    return {
      error: 'Unauthorized'
    };
  }

  const uid = String(await ChatModel.findOne({ id }).select('userId'));

  if (uid !== res.data?._id) {
    return {
      error: 'Unauthorized'
    };
  }

  await ChatModel.findByIdAndDelete(id);

  revalidatePath('/');
  return revalidatePath(path);
}

export async function clearChats() {
  await mongooseConnect();
  const res = await getMe();

  if (res.error) {
    return {
      error: 'Unauthorized'
    };
  }

  const chats = await ChatModel.find({ userId: res.data._id });

  if (!chats.length) {
    return redirect('/');
  }

  const chatIds = chats.map((chat) => chat.id);
  await ChatModel.deleteMany({ id: { $in: chatIds } });

  await User.updateOne(
    { _id: res.data._id },
    { $pull: { chatIds: { $in: chatIds } } }
  ).exec();

  revalidatePath('/');
  return redirect('/');
}

export async function getSharedChat(id: string) {
  await mongooseConnect();
  const chat = await ChatModel.findOne({ id });

  if (!chat || !chat.sharePath) {
    return null;
  }

  return chat as Chat;
}

export async function shareChat(id: string) {
  await mongooseConnect();
  const res = await getMe();

  if (res.error) {
    return {
      error: 'Unauthorized'
    };
  }

  const chat = await ChatModel.findOne({ id });

  if (!chat || chat.userId !== res.data._id) {
    return {
      error: 'Something went wrong'
    };
  }

  chat.sharePath = `/share/${chat.id}`;

  await chat.save();

  return chat;
}

export async function saveChat(chat: Chat) {
  await mongooseConnect();
  const res = await getMe();
  if (res && res.data) {
    const isExist = await ChatModel.findOne({ id: chat.id });

    let updatedChat;

    if (isExist) {
      updatedChat = await ChatModel.findOneAndUpdate({ id: chat.id }, chat, {
        new: true
      });
    }

    updatedChat = await ChatModel.create(chat);

    await User.findOneAndUpdate(
      { _id: res.data._id },
      { $addToSet: { chatIds: updatedChat.id } }
    );

    return updatedChat;
  } else {
    return;
  }
}

export async function refreshHistory(path: string) {
  await mongooseConnect();
  redirect(path);
}

export async function getMissingKeys() {
  await mongooseConnect();
  const keysRequired = ['GOOGLE_GENERATIVE_AI_API_KEY'];
  return keysRequired
    .map((key) => (process.env[key] ? '' : key))
    .filter((key) => key !== '');
}
