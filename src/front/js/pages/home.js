import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../../styles/home.css";

export const Home = () => {
  const history = useHistory();
  const handleonClick = async () => {
    const response = await fetch(process.env.BACKEND_URL + "/api/collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "",
        description: "",
        attributes: JSON.stringify([]),
        url: "",
        owner_account: "",
        contract_account: "",
        fee: 0,
        transferred: false,
      }),
    });

    if (response.status === 200) {
      const payload = await response.json();
      history.push("/collection/" + payload.id);
    }
  };

  return (
    <div className="text-center mt-5">
      <h1 className="neonText">
        The <span id="new">New</span> Age
      </h1>
      <Button className="coloredbtn" onClick={handleonClick}>
        Create NFT Collection
      </Button>
    </div>
  );
};
