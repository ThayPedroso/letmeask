import { createContext, ReactNode, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { auth, firebase } from "../services/firebase"

import { Spinner } from "@chakra-ui/react"

type User = {
    id: string;
    name: string;
    avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signOutWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [ user, setUser ] = useState<User>()
    const [ loading, setLoading] = useState(true)
    const history = useHistory()

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          const { displayName, photoURL, uid } = user

          if (!displayName || !photoURL) {
            throw new Error('Missing information from Google Account.')
          }

          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
          setLoading(false)
        }
      })

      return () => {
      unsubscribe();
      }
    }, [])

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider)

        if (result.user) {
            const { displayName, photoURL, uid } = result.user

            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account.')
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }

    async function signOutWithGoogle() {
      await auth.signOut()
      setUser(undefined)
      history.push('/')
    }

    if (loading) {
      return (
        <div id="spinner">
          <Spinner size="xl" thickness="4px" speed="0.65s" color="purple"/>
          <h1>Aguarde...</h1>
        </div>
      )
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signOutWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
};
