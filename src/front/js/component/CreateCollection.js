import React, { useState, useEffect } from "react";
import { CollectionView } from "./CollectionView";
import Button from "react-bootstrap/Button";
import "../../styles/inputs.scss";
import { NftView } from "./NftView";
import { useParams } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../store/api";
import { ContractFactory, providers } from "ethers";
import NFTForgeContract from "./NFTForge.json";
import { Alert } from "react-bootstrap";

export function CreateCollection() {
  const params = useParams();
  const { data, error } = useSWR("/api/collection/" + params.id, fetcher);
  const { mutate } = useSWRConfig();
  const [isMinting, setMinting] = useState(false);

  const [nfts, setNfts] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [collection, setCollection] = useState({
    name: "",
    description: "",
    attributes: [],
    url: "",
    mainnet: false,
  });
  const [ethereumNetWork, setEthereumNetwork] = useState(
    global.ethereum.chainId
  );

  const handleMint = async () => {
    await handleSave();
    if (typeof global.ethereum !== "undefined") {
      try {
        setMinting(true);
        await requestAccount();
        const provider = new providers.Web3Provider(global.ethereum);
        const signer = provider.getSigner();

        // deploy contract here
        const NFTForge = new ContractFactory(
          NFTForgeContract.abi,
          NFTForgeContract.bytecode,
          signer
        );
        let nftForge;
        if (!data.contract_account) {
          nftForge = await NFTForge.deploy(
            process.env.BACKEND_URL + "/api/opensea/" + data.id + "/",
            nfts.map((nft) => nft.quantity)
          );

          await nftForge.deployed();
        } else {
          nftForge = NFTForge.attach(data.contract_account);
        }
        const ids = await nftForge.getIds();

        const response = await fetch(
          process.env.BACKEND_URL + "/api/collection/" + params.id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              ...collection,
              nfts: nfts.map((nft, index) => {
                return {
                  ...nft,
                  nft_id: ids[index].toString(),
                };
              }),
              contract_account: nftForge.address,
              owner_account: global?.ethereum?.selectedAddress,
            }),
          }
        );
        if (response.status === 204) {
          mutate("/api/collection/" + params.id);
        }
        setMinting(false);
      } catch (err) {
        console.log("Error: ", err);
        setMinting(false);
        set({ transferring: false });
      }
    }
  };
  const requestAccount = async () => {
    await global.ethereum.request({ method: "eth_requestAccounts" });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        process.env.BACKEND_URL + "/api/collection/" + params.id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            ...collection,
            attributes: JSON.stringify(collection.attributes),
            nfts: nfts,
          }),
        }
      );
      if (response.status === 204) {
        /// TODOD : Send NFT
        mutate("/api/collection/" + params.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data) {
      setCollection({
        name: data.name,
        description: data.description,
        attributes: JSON.parse(data.attributes),
        url: data.url,
        mainnet: data.mainnet,
      });
      setNfts(data.nfts);
      setDisabled(!!data.contract_account);
    }
  }, [data]);

  useEffect(() => {
    global.ethereum.on("accountsChanged", function (accounts) {
      setCollection({
        ...collection,
        mainnet: global.ethereum.chainId === "0x1",
      });
      console.log(accounts);
      setEthereumNetwork(global.ethereum.chainId);
    });
  }, []);

  return (
    <div className="text-center mt-5">
      <h1>Create NFT Collection!</h1>

      <div className="add-collection">
        {ethereumNetWork === "0x1" && !disabled && (
          <Alert variant={"primary"}>You are on the MainNet</Alert>
        )}
        {ethereumNetWork === "0x4" && !disabled && (
          <Alert variant={"warning"}>You are on the Rinkeby test network</Alert>
        )}
        <CollectionView
          value={collection}
          onChange={(value) => setCollection(value)}
          onSave={handleSave}
          onMint={handleMint}
          minted={data && data.contract_account}
          readOnly={disabled}
          isMinting={isMinting}
        />
        {nfts.map((nft, index) => {
          return (
            <NftView
              value={nft}
              key={index}
              mainnet={collection.mainnet}
              readOnly={disabled}
              contract={data && data.contract_account}
              onChange={(value) => {
                const newNfts = [...nfts];
                newNfts[index] = value;
                setNfts(newNfts);
              }}
            />
          );
        })}

        {!disabled && (
          <div className="add-remove">
            <Button
              id="add"
              className="w-50"
              onClick={() => {
                setNfts([
                  ...nfts,
                  {
                    name: "",
                    description: "",
                    attributes: "",
                    quantity: 0,
                    image: "",
                    nft_id: "",
                    image_url: "",
                    contract_id: "",
                  },
                ]);
              }}
            >
              Add More
            </Button>
            <Button
              id="remove"
              className="w-50"
              variant="danger"
              onClick={() => {
                const list = [...nfts];
                list.pop(nfts);
                setNfts(list);
              }}
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
