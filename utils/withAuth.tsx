import { useRouter } from "next/router";
import React from 'react';
import { useEffect, ComponentType, FC } from "react";
import { getToken } from '../helperFunctions/localStorageHelper';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>): FC<P> => {
  const ComponentWithAuth:FC<P> = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = getToken();
      if (!token) {
        router.push("/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
