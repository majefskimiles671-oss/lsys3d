import type { RuleSet } from "../../core/RuleSet.js";

export const ruleSets: Map<string, RuleSet> = new Map([
    [
        "Plant3D",
        {
            X: "F[+X][-X][&X][/X]",
            F: "FF",
        }
    ],

    [
        "Starburst",
        {

            X: "F[+X][-X][&X][^X][/X][\\X]",
            F: "FF"

        }

    ],

    [
        "SimpleTree",
        {
            X: "F[+X][-X]",
            F: "FF",
        }
    ],

    [
        "SpiralTree",
        {
            X: "F[+X]F[-X]F",
            F: "F",
        }
    ],

    [
        "SunCorona",

        {
            X: "F[+X]F[-X]F[&X]F[^X]F[/X]F[\\X]",
            F: "F"
        }

    ],

    [
        "Dense3Dstar",
        {
            X: "F[+X][-X][&X][/X]FX",
            F: "FF"
        }
    ]
]);