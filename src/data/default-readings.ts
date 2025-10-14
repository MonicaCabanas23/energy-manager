import { Reading } from "@/types/circuits";

export const defaultReadings: Reading[] = [
    {
        name           : 'L1',
        doublePolarity : false,
        intensity      : 0,
        voltage        : 0
    },{
        name           : 'L2',
        doublePolarity : false,
        intensity      : 0,
        voltage        : 0
    },{
        name           : 'N',
        doublePolarity : false,
        intensity      : 0,
        voltage        : 0
    },{
        name           : 'C1',
        doublePolarity : false,
        intensity      : 0,
        voltage        : 0
    },{
        name           : 'C2,C4',
        doublePolarity : true,
        intensity      : 0,
        voltage        : 0
    },{
        name           : 'C3',
        doublePolarity : false,
        intensity      : 0,
        voltage        : 0
    },
]