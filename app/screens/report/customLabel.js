import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-svg'
import { _formatPercent } from '../../helpers';
import { scale } from '../../utils/scalingUtils';
import { Fonts } from '../../utils/styleUtils';

export const Labels = ({ slices, height, width, totalFee }) => {
    return slices.map((slice, index) => {
        const { labelCentroid, pieCentroid, data } = slice;
        return (
            <View key={index}>
                <Text
                    x={pieCentroid[0]}
                    y={pieCentroid[1]}
                    fill={'white'}
                    textAnchor={'middle'}
                    alignmentBaseline={'central'}
                    fontSize={scale(10)}
                    fontFamily={Fonts.NanumBarunGothic_Regular.fontFamily}
                    stroke={'black'}
                    strokeWidth={0.2}
                >
                    {data.x}
                </Text>
                <Text
                    x={pieCentroid[0]}
                    y={pieCentroid[1]+10}
                    fill={'white'}
                    textAnchor={'middle'}
                    alignmentBaseline={'central'}
                    fontSize={scale(8)}
                    fontFamily={Fonts.NanumBarunGothic_Regular.fontFamily}
                    stroke={'black'}
                    strokeWidth={0.2}
                >
                    {`${_formatPercent(data.y / totalFee)}%`}
                </Text>
            </View>
        )
    })
}

export const ColLabels = ({ x, y, bandwidth, data, cutOff=20 }) => (
    data.map((value, index) => (
        <Text
            key={ index }
            x={ x(index) + (bandwidth / 2) }
            y={ value < cutOff ? y(value) - 10 : y(value) + 15 }
            fontSize={ 14 }
            fill={ value >= CUT_OFF ? 'white' : 'black' }
            alignmentBaseline={ 'middle' }
            textAnchor={ 'middle' }
        >
            {value}
        </Text>
    ))
)