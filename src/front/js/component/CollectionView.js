import React from "react";
import {
  Card,
  Row,
  Col,
  FormControl,
  InputGroup,
  Button,
  Form,
} from "react-bootstrap";

export function CollectionView(props) {
  return (
    <Card>
      <Card.Body>
        <Row>
          <Col>
            <InputGroup size="sm" className="mb-3">
              <FormControl
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                placeholder="Name"
                value={props.value.name}
                readOnly={props.readOnly}
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
                aria-describedby="inputGroup-sizing-sm"
                placeholder="Description"
                readOnly={props.readOnly}
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
                aria-describedby="inputGroup-sizing-sm"
                placeholder="Attributes"
                readOnly={props.readOnly}
                value={props.value.atttributes}
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
                aria-describedby="inputGroup-sizing-sm"
                placeholder="Url"
                readOnly={props.readOnly}
                value={props.value.url}
                onChange={(ev) =>
                  props.onChange({
                    ...props.value,
                    url: ev.target.value,
                  })
                }
              />
            </InputGroup>
          </Col>
          {props.minted ? (
            <Col>Collection was minted</Col>
          ) : (
            <Col>
              <Button variant="primary" size="lg" onClick={props.onMint}>
                Mint
              </Button>
              <Button variant="success" size="lg" onClick={props.onSave}>
                Save
              </Button>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}
/// https://testnets-api.opensea.io/api/v1/asset/0xeead1c2e73c8e56006daac9965068ab8a5862e65/89709943143508079645487382081457606758645057766810080151039064118147953823045/?force_update=true
