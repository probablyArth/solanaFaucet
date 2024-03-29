import { modals } from "@mantine/modals";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Head from "next/head";
import { useState } from "react";
import { TbExternalLink } from "react-icons/tb";
import { LoadingOverlay } from "@mantine/core";

enum Network {
  testNet = "https://api.testnet.solana.com/",
  devNet = "https://api.devnet.solana.com/",
}

const Footer = () => {
  return (
    <div className="flex flex-col mt-20">
      <h1>
        Made with ❤️ by{" "}
        <a
          href="https://github.com/probablyarth"
          className="underline"
          target="_blank"
        >
          @probablyarth
        </a>
      </h1>
      <h1>
        Insipired from{" "}
        <a
          href="https://www.youtube.com/watch?v=8NeZgmSfbYg"
          target="_blank"
          className="underline"
        >
          Harkirat Singh 🤓
        </a>
      </h1>
    </div>
  );
};

const validateSolanaAddress = (addrs: string) => {
  let publicKey: PublicKey;
  try {
    publicKey = new PublicKey(addrs);
    return PublicKey.isOnCurve(publicKey.toBytes());
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default function Home() {
  const [network, setNetwork] = useState<Network>(Network.devNet);
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendSol = () => {
    if (!validateSolanaAddress(address)) return setError("Invalid address!");
    setError("");
    const connection = new Connection(network);
    setLoading(true);
    connection
      .requestAirdrop(new PublicKey(address), 1 * LAMPORTS_PER_SOL)
      .then((value) => {
        modals.open({
          title: (
            <h1 className="text-2xl text-green-500 font-semibold">Success!</h1>
          ),
          children: (
            <h1 className="flex items-center gap-2">
              Transaction of 1 sol successful! That may or may not be true
              please check from this link.
              <a
                href={`https://explorer.solana.com/tx/${value}?cluster=${
                  network === Network.devNet ? "devnet" : "testnet"
                }`}
                target="_blank"
                className="color-white"
              >
                <TbExternalLink />
              </a>
            </h1>
          ),
        });
      })
      .catch((err) => {
        modals.open({
          title: (
            <h1 className="text-2xl text-red-500 font-semibold">Error!</h1>
          ),
          children: <h1>An error occurred, please try again later!</h1>,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>Solana Faucet</title>
        <meta name="description" content="Solana faucet by @probablyarth" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center items-center w-screen h-screen bg-[#101010] text-white text-center">
        <div className="flex flex-col gap-4 items-center w-[80%] min-w-[320px]">
          <div className="flex items-center justify-between w-full">
            <div className="flex justify-center items-center gap-4">
              <h1 className="text-5xl">Solana faucet</h1>
              {error && (
                <div className="text-red-500 bg-white p-2 rounded-sm font-extrabold">
                  {error}
                </div>
              )}
            </div>
            <div className="flex rounded-md border border-white">
              <button
                onClick={() => {
                  setNetwork(Network.devNet);
                }}
                className={`${
                  network === Network.devNet && "bg-white text-black"
                } rounded-l-md p-4 transition-colors duration-300`}
              >
                DevNet
              </button>
              <button
                onClick={() => {
                  setNetwork(Network.testNet);
                }}
                className={`${
                  network === Network.testNet && "bg-white text-black"
                } rounded-r-md p-4 transition-colors duration-300`}
              >
                TestNet
              </button>
            </div>
          </div>
          <div className="flex w-full gap-4">
            <input
              type="text"
              placeholder="your wallet address"
              className="p-4 rounded-md text-black w-full"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value.trim());
              }}
            />
          </div>
          <div className="relative w-full">
            <button
              className="bg-white text-black w-full rounded-md p-4 hover:opacity-70 transition-opacity relative"
              onClick={sendSol}
            >
              Send
            </button>
            <LoadingOverlay
              loaderProps={{ size: "md", color: "black", variant: "oval" }}
              overlayColor="#c5c5c5"
              visible={loading}
              className="rounded-md"
            />
          </div>
          <h1>Devnet and Testnet have a limit of 1 sol per day</h1>
        </div>
        <Footer />
      </main>
    </>
  );
}
