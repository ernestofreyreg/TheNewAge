import React, { useState, useEffect } from "react";
import { CollectionView } from "./CollectionView";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../../styles/inputs.scss";
import { NftView } from "./NftView";
import { useParams } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../store/api";

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
  });

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
            name: collection.name,
            description: collection.description,
            attributes: collection.attributes,
            url: collection.url,
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
      });
      setNfts(data.nfts);
    }
  }, [data]);

  return (
    <div>
      <h1>Create NFT Collection!</h1>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="MainNet"
        checked={data && data.mainnet}
      />
      <div className="add-collection">
        <CollectionView
          value={collection}
          onChange={(value) => setCollection(value)}
          onSave={handleSave}
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
