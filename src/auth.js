import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            id: "jwt",
            name: "JWT",
            credentials: {
                token: { type: "text" }
            },
            async authorize(credentials) {
                const token = credentials?.token;
                if (!token) return null;
                try {
                    const decoded = jwtDecode(token);

                    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;

                    const toTitleCase = (s) => s ? s.toLocaleLowerCase("tr-TR").replace(/^./, (c) => c.toLocaleUpperCase("tr-TR")) : "";

                    return {
                        email: decoded.email,
                        name: [decoded.firstName, decoded.lastName].filter(Boolean).map(toTitleCase).join(" ") || decoded.name,
                        department: decoded.department,
                        authorities: decoded.authorities || [],
                        backendToken: token
                    };
                } catch {
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.department = user.department;
                token.authorities = user.authorities;
                token.backendToken = user.backendToken;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.department = token.department;
            session.user.authorities = token.authorities || [];
            session.backendToken = token.backendToken;
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    trustHost: true,
});