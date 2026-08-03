import { useCallback, useEffect, useRef } from "react";
import { Keyboard, Platform } from "react-native";

// iOS fires the Will events as the animation starts; Android only has the Did ones.
// Listening for Did on iOS leaves a window during the slide-up where the keyboard is
// on screen but this hook still thinks it is closed.
const SHOW_EVENT = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
const HIDE_EVENT = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

/**
 * Returns a press wrapper that spends the first tap dismissing the keyboard when it is
 * open, and runs the action otherwise. Visibility is a ref rather than state because no
 * caller renders from it, so tracking it costs no re-renders.
 */
export function useDismissKeyboardFirst() {
  const isVisible = useRef(false);

  useEffect(() => {
    const show = Keyboard.addListener(SHOW_EVENT, () => {
      isVisible.current = true;
    });
    const hide = Keyboard.addListener(HIDE_EVENT, () => {
      isVisible.current = false;
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return useCallback((action?: () => void) => {
    if (isVisible.current) {
      Keyboard.dismiss();
      return;
    }
    action?.();
  }, []);
}
