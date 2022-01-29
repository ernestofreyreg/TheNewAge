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
              <Form.Check
                type="switch"
                id="custom-switch"
                label="MainNet"
                onChange={(ev) => {
                  props.onChange({
                    ...props.value,
                    mainnet: ev.target.checked,
                  });
                }}
                checked={props.value.mainnet}
              />
            </InputGroup>

            <InputGroup size="sm" className="mb-3">
              <FormControl
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                placeholder="Name"
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
                aria-describedby="inputGroup-sizing-sm"
                placeholder="Attributes"
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
          <Col>
            <Button variant="primary" size="lg">
              MINT
            </Button>
            <Button variant="success" size="lg" onClick={props.onSave}>
              Save
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
