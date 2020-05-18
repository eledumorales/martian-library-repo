// /app/javascript/components/UpdateItemForm

import React from 'react';
import { Mutation } from 'react-apollo';
import { UpdateItemMutation } from './operations.graphql';
import { DeleteItemMutation } from './operations.graphql';
import { LibraryQuery } from '../Library/operations.graphql';
import ProcessItemForm from '../ProcessItemForm';
import cs from './styles';

const UpdateItemForm = ({
  id,
  initialTitle,
  initialDescription,
  initialImageUrl,
  onClose,
  onErrors,
  errors,
}) => (
  <div className={cs.overlay}>
    <div className={cs.content}>
      <button className={cs.close} onClick={onClose}>X</button>
      <Mutation mutation={UpdateItemMutation}>
        {(updateItem, { loading }) => (
          <ProcessItemForm
            initialImageUrl={initialImageUrl}
            initialTitle={initialTitle}
            initialDescription={initialDescription}
            errors={errors}
            buttonText="Update Item"
            loading={loading}
            onProcessItem={({ title, description, imageUrl }) => {
              updateItem({
                variables: {
                  id,
                  title,
                  description,
                  imageUrl,
                },
                optimisticResponse: {
                  __typename: 'Mutation',
                  updateItem: {
                    __typename: 'UpdateItemMutationPayload',
                    item: {
                      id,
                      __typename: 'Item',
                      title,
                      description,
                      imageUrl,
                    },
                    errors: null,
                  },
                },
              }).then(({ data }) => {
                onErrors(data.updateItem.errors);
              });
              onClose();
            }}
          />
        )}
      </Mutation>

      <Mutation mutation={DeleteItemMutation}>
      {(deleteItem, { loading, data }) => (
        <button className={cs.delete} onClick={() => {
          deleteItem({
            variables: {
              id,
            },
            update: (cache, { data: { deleteItem } }) => {
              {
                const item = deleteItem.item;
                if (item) {
                  const currentItems = cache.readQuery({ query: LibraryQuery });
                  cache.writeQuery({
                    query: LibraryQuery,
                    data: {
                      items: currentItems.items.filter(it => it.id !== item.id),
                    },
                  });
                }
              }
            },
          })
          onClose();
          // window.location.reload();
        }}
        > Delete
        </button>
      )}
      </Mutation>

    </div>
  </div>
);

export default UpdateItemForm;
