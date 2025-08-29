import Cookies from "js-cookie";

export const guardarCookie = (
  key: string,
  value: string,
  options?: Cookies.CookieAttributes
) => {
  Cookies.set(key, value, {
    secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === "true",
    sameSite: "strict",
    ...options,
  });
};

export const leerCookie = (key: string): string | undefined => {
  return Cookies.get(key);
};

export const eliminarCookie = (key: string) => {
  return Cookies.remove(key);
};

export const eliminarCookies = () => {
  Object.keys(Cookies.get()).forEach((cookieName) => {
    Cookies.remove(cookieName);
  });
};
