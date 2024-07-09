'use client';

import {
  XYPlot,
  MarkSeries,
  LineSeries,
  LabelSeries,
  DiscreteColorLegend,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis
} from 'react-vis';

interface GraphData {
  x: number;
  y: number;
  label: string;
  id: string;
  size: number;
  color: string;
  opacity: number;
  place_type: string[];
}

interface Props {
  data: GraphData[];
}

const NetworkGraph = ({ data }: Props) => {
  const markSeriesProps = {
    animation: true,
    className: 'mark-series-example',
    sizeRange: [5, 7],
    seriesId: 'my-example-network',
    data,
    style: {
      stroke: 'black',
      strokeWidth: 3,
      fill: '#ffffff'
    }
  };

  const groupDataByPlaceType = (data: GraphData[]) => {
    return data.reduce(
      (acc, point) => {
        // Convert place_type array to a string
        const placeType = point.place_type.join(', ');

        if (!acc[placeType]) {
          acc[placeType] = [];
        }
        acc[placeType].push(point);
        return acc;
      },
      {} as { [key: string]: GraphData[] }
    );
  };
  const groupedData = groupDataByPlaceType(data);

  const labelSeriesProps = {
    data,
    getLabel: (d: any) => d.label,
    getPosition: (d: any) => ({ x: d.x, y: d.y }),
    style: {
      fill: 'black',
      fontSize: 14,
      strokeWidth: 4
    }
  };

  const colors = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf'
  ];

  const getColorForKey = (key: string) => {
    const index = Object.keys(groupedData).indexOf(key);
    return colors[index % colors.length];
  };

  return (
    <div className="canvas-wrapper mt-10 flex min-h-[70vh] w-full flex-col items-center gap-4 bg-gray-100 px-4 py-6">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-sm font-bold md:text-lg lg:text-xl">Place type</h1>
        <div className="flex gap-6">
          {Object.keys(groupedData).map((key) => (
            <DiscreteColorLegend
              key={key}
              className="text-xs font-semibold md:text-base lg:text-lg"
              items={[
                {
                  title: key.toUpperCase(),
                  color: getColorForKey(key),
                  strokeWidth: 10
                }
              ]}
              orientation="vertical"
            />
          ))}
        </div>
      </div>
      <XYPlot width={1000} height={1000} margin={50}>
        <HorizontalGridLines style={{ stroke: '#B7E9ED' }} />
        <VerticalGridLines style={{ stroke: '#B7E9ED' }} />
        <XAxis
          title="X Axis"
          style={{
            line: { stroke: '#ADDDE1' },
            ticks: { stroke: '#ADDDE1' },
            text: { stroke: 'none', fill: '#6b6b76', fontWeight: 600 }
          }}
        />
        <YAxis title="Y Axis" orientation="right" />
        <MarkSeries
          {...markSeriesProps}
          style={{ fill: '#fff', strokeWidth: 3, stroke: 'black' }}
        />
        {Object.keys(groupedData).map((key) => (
          <LineSeries
            key={key}
            data={groupedData[key]}
            animation
            className={`line-series-${key}`}
            style={{
              stroke: getColorForKey(key),
              strokeLinejoin: 'round',
              strokeWidth: 4
            }}
            curve={'curveMonotoneX'}
          />
        ))}
        <LabelSeries
          {...labelSeriesProps}
          allowOffsetToBeReversed
          animation
          marginTop={35}
          marginLeft={30}
          labelAnchorY="start"
          labelAnchorX="middle"
        />
      </XYPlot>
    </div>
  );
};

export default NetworkGraph;
