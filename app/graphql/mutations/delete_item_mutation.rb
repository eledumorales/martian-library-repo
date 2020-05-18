module Mutations
  class DeleteItemMutation < Mutations::BaseMutation
    argument :id, ID, required: true

    field :item, Types::ItemType, null: true
    field :errors, Types::ValidationErrorsType, null: true # <= change here

    def resolve(id:)
      check_authentication!

      item = Item.find(id)

      if Item.delete(id)
        MartianLibrarySchema.subscriptions.trigger("itemDeleted", {}, item)
        { item: item }
      else
        { errors: errors.full_messages }
      end
    end
  end
end
