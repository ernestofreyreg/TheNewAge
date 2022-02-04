import React from "react";
import {
  Card,
  Row,
  Col,
  FormControl,
  InputGroup,
  Button,
} from "react-bootstrap";
import { UploadImage } from "../component/UploadImage";

export function NftView(props) {
  return (
    <Card>
      <Card.Body>
        {props.minted ? (
          <Col>Minted</Col>
        ) : (
          <Row>
            <Col>
              <InputGroup size="sm" className="mb-3">
                <FormControl
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Name"
                  readOnly={props.readOnly}
                  value={props.value.name}
                  onChange={(ev) =>
                    props.onChange({
                      ...props.value,
                      name: ev.target.value,
                    })
                  }
                />
              </InputGroup>
              <InputGroup size="sm" className="mb-3">
                <FormControl
                  aria-label="Small"
                  readOnly={props.readOnly}
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Description"
                  value={props.value.description}
                  onChange={(ev) =>
                    props.onChange({
                      ...props.value,
                      description: ev.target.value,
                    })
                  }
                />
              </InputGroup>
              <InputGroup size="sm" className="mb-3">
                <FormControl
                  aria-label="Small"
                  readOnly={props.readOnly}
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Attributes"
                  value={props.value.attributes}
                  onChange={(ev) =>
                    props.onChange({
                      ...props.value,
                      attributes: ev.target.value,
                    })
                  }
                />
              </InputGroup>
              <InputGroup size="sm" className="mb-3">
                <FormControl
                  aria-label="Small"
                  readOnly={props.readOnly}
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Quantity"
                  value={props.value.quantity}
                  onChange={(ev) =>
                    props.onChange({
                      ...props.value,
                      quantity: ev.target.value,
                    })
                  }
                />
              </InputGroup>
            </Col>
            <Col>
              <div>
                <UploadImage
                  value={props.value.image_url}
                  onChange={(cid) => {
                    props.onChange({
                      ...props.value,
                      image_url: cid,
                    });
                  }}
                />
              </div>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}
