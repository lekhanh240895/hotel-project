// components/NetworkGraphVis.js
'use client';

import { useEffect } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
// import 'vis-network/styles/vis-network.css';

const NetworkGraphVis = () => {
  useEffect(() => {
    // Dữ liệu đồ thị
    const nodes = new DataSet([
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' }
    ]);
    const edges = new DataSet<any>([
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 2, to: 4 }
    ]);
    const data = {
      nodes: nodes,
      edges: edges
    };

    // Tùy chọn hiển thị
    const options = {};

    // Khởi tạo network
    const container = document.getElementById('network');
    const network = new Network(container!, data, options);

    // Cleanup khi component unmount
    return () => {
      network.destroy();
    };
  }, []);

  return <div id="network" style={{ height: '600px' }}></div>;
};

export default NetworkGraphVis;
