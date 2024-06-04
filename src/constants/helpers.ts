export const rangeColors = [
    {
        min: 0,
        max: 40,
        span: 1,
        color: 'green-500',
        name: 'Good',
        description: "Air quality is considered satisfactory, and air pollution poses little or no risk"
    },
    {
        min: 41,
        max: 80,
        span: 1,
        color: 'yellow-400',
        name: 'Moderate',
        description: "Air quality is acceptable; however, for some pollutants there may be a moderate health concerns."
    }, 
    {
        min: 81,
        max: 120,
        span: 1,
        color: 'orange-300',
        name: 'Bad',
        description: "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
    },
    {
        min: 121,
        max: 200,
        span: 2,
        color: 'red-500',
        name: 'Very bad',
        description: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
    },
    {
        min: 201,
        max: '208+',
        span: 2,
        color: 'violet-600',
        name: 'Terrible',
        description: "Health alert: everyone may experience more serious health effects"
    }
]

export function getRangeColor(aqi: number) {
    if (isNaN(aqi) || aqi === 0) {
        return {
            color: 'black',
            name: 'No Data'
        };
    }

    return rangeColors.find(({ min, max }) => {
        return typeof max === 'string'
            ? aqi >= min
            : aqi >= min && aqi <= max
    })
}