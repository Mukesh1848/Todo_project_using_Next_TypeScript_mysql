import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import { UserProvider } from "../utils/userContext";
import HomePage from "../components/homePage";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {1

  return (
    <>
        <UserProvider> 
        <Header />
        <div className="text-center text-3xl my-20  text-green-700 font-bold">
           <HomePage />
        </div>
       </UserProvider>
    </>
  );
}