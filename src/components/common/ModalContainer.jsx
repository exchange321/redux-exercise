import React, { PropTypes } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalContainer = ({
    isOpen, toggle, handleFormSubmit,
    title, bodyContent, footerContent }) => (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            backdrop
        >
            <form onSubmit={handleFormSubmit}>
                <ModalHeader toggle={toggle}>
                    {title}
                </ModalHeader>
                <ModalBody>
                    {bodyContent}
                </ModalBody>
                <ModalFooter>
                    {footerContent}
                </ModalFooter>
            </form>
        </Modal>
);

ModalContainer.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    handleFormSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    bodyContent: PropTypes.element.isRequired,
    footerContent: PropTypes.element.isRequired,
};

export default ModalContainer;
