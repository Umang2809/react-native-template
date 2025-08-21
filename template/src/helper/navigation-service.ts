// navigationService.ts
import * as React from "react";
import { CommonActions, StackActions } from "@react-navigation/native";
import type { NavigationContainerRef } from "@react-navigation/native";

// Create a ref to hold navigation
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

/**
 * Navigate to a screen by name
 */
export function navigate(name: string, params?: object) {
    navigationRef.current?.navigate(name, params);
}

/**
 * Go back to the previous screen
 */
export function goBack() {
    navigationRef.current?.goBack();
}

/**
 * Reset navigation with multiple routes
 */
export function navigateAndReset(
    routes: { name: string; params?: object }[] = [],
    index = 0
) {
    navigationRef.current?.dispatch(
        CommonActions.reset({
            index,
            routes,
        })
    );
}

/**
 * Reset navigation with a single route
 */
export function navigateAndSimpleReset(name: string, index = 0) {
    navigationRef.current?.dispatch(
        CommonActions.reset({
            index,
            routes: [{ name }],
        })
    );
}

/**
 * Push a new screen on top of the stack
 */
export function push(name: string, params?: object) {
    navigationRef.current?.dispatch(StackActions.push(name, params));
}

/**
 * Pop the current screen
 */
export function pop(count: number = 1) {
    navigationRef.current?.dispatch(StackActions.pop(count));
}

/**
 * Pop to the top of the stack
 */
export function popToTop() {
    navigationRef.current?.dispatch(StackActions.popToTop());
}
