/* eslint-disable react/prop-types */
import React, { useState, useContext } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  FormLabel,
  IconButton,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/core';
import { FirebaseContext } from '../firebase';
import useFormValidation from '../hooks/useFormValidation';
import { validateListForm } from '../utils';

const INITIAL_STATE = {
  title: '',
  description: '',
};

function EditListModal({ list }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { firebase, user } = useContext(FirebaseContext);
  const [firebaseError, setFirebaseError] = useState(null);
  // Hooks must be at the top of the function ( one of the rules of hooks)
  const {
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    values,
  } = useFormValidation(INITIAL_STATE, validateListForm, editList);

  // made this regular function declaration so it can be declared after the hook.
  // changed name to editList
  async function editList() {
    // changed name to editedList
    const editedList = {
      // weird that the list ID is being spread in in firebase
      // can't figure out how to make it stop
      ...list,
      title: values.title,
      description: values.description,
      // changed to match the date formatting.
      modifiedAt: Date.now(),
    };
    try {
      await firebase.editWatchList(editedList, user.uid);
      onClose();
    } catch (error) {
      setFirebaseError(error.message);
    }
  }

  return (
    <>
      <IconButton icon="edit" variant="ghost" mr={2} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit List Details</ModalHeader>
          <ModalCloseButton />
          <form>
            <ModalBody>
              <FormControl isInvalid={errors.title}>
                <FormLabel htmlFor="title">Title: </FormLabel>
                <Input
                  name="title"
                  variant="outline"
                  placeholder="List Title"
                  type="string"
                  isRequired
                  defaultValue={list.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormErrorMessage maxWidth="200px">
                  {errors.title}
                </FormErrorMessage>
              </FormControl>

              <FormLabel htmlFor="description">Description: </FormLabel>

              <Input
                id="description"
                name="description"
                variant="outline"
                placeholder="List Description"
                defaultValue={list.description}
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </ModalBody>

            <ModalFooter>
              <Button color="red" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                color="green"
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Save Changes
              </Button>
              <FormControl isInvalid={firebaseError}>
                <FormErrorMessage maxWidth="220px">
                  {firebaseError}
                </FormErrorMessage>
              </FormControl>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditListModal;
