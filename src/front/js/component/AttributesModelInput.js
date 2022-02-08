import React from "react";
import PropTypes from "prop-types";
import { Button, InputGroup, FormControl } from "react-bootstrap";

export const AttributesModelInput = (props) => {
  return (
    <>
      <div>Attributes</div>

      <div>
        <Button variant="outline-secondary" size="sm">
          Add Attribute
        </Button>
      </div>
    </>
  );
};

AttributesModelInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

const AttributeItemInput = (props) => {
  return (
    <div>
      <InputGroup size="sm" className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-sm">Name</InputGroup.Text>
        <FormControl />
      </InputGroup>
    </div>
  );
};
