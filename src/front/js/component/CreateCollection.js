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

export function CreateCollection() {
  const params = useParams();
  const { data, error } = useSWR("/api/collection/" + params.id, fetcher);
  const { mutate } = useSWRConfig();

  const [nfts, setNfts] = useState([]);

  const [collection, setCollection] = useState({
    name: "",
    description: "",
    attributes: "",
    url: "",
    mainnet: false,
  });

  const handleMint = async () => {
    if (typeof global.ethereum !== "undefined") {
      try {
        await requestAccount();
        const provider = new providers.Web3Provider(global.ethereum);
        const signer = provider.getSigner();

        // deploy contract here
        const NFTForge = new ContractFactory(
          NFTForgeContract.abi,
          NFTForgeContract.bytecode,
          signer
        );

        const nftForge = await NFTForge.deploy(
          process.env.BACKEND_URL + "/api/opensea/",
          nfts.map((nft) => nft.quantity)
        );

        await nftForge.deployed();
        console.log("NFTForge deployed to: ", nftForge.address);
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
                nfts: nfts,
                contract_account: nftForge.address,
                owner_account: global?.ethereum?.selectedAddress,
              }),
            }
          );
          if (response.status === 204) {
            mutate("/api/collection/" + params.id);
          }
        } catch (error) {
          console.log(error);
        }
        // const contract = new ethers.Contract(
        //   learnpackAddress,
        //   Learnpack.abi,
        //   signer
        // );

        // set({ transferring: true });
        // const transaction = await contract.safeTransferFrom(
        //   global.ethereum.selectedAddress,
        //   address,
        //   tokenId,
        //   amount,
        //   ethers.utils.arrayify(0)
        // );
        // await transaction.wait();
        // set({ transferring: false });
        // get().fetchBalances();
      } catch (err) {
        console.log("Error: ", err);
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
        attributes: data.attributes,
        url: data.url,
        mainnet: data.mainnet,
      });
      setNfts(data.nfts);
    }
  }, [data]);

  // useEffect(() => {
  //   global.ethereum.on("accountsChanged", function (accounts) {
  //     console.log(accounts);
  //   });
  // }, []);

  return (
    <div>
      <h1>Create NFT Collection!</h1>
      {global?.ethereum?.selectedAddress}
      <div className="add-collection">
        <CollectionView
          value={collection}
          onChange={(value) => setCollection(value)}
          onSave={handleSave}
          onMint={handleMint}
          minted={data && data.contract_account !== null}
        />
        {nfts.map((nft, index) => {
          return (
            <NftView
              value={nft}
              key={index}
              onChange={(value) => {
                const newNfts = [...nfts];
                newNfts[index] = value;
                setNfts(newNfts);
              }}
            />
          );
        })}
        <Button
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
    </div>
  );
}
