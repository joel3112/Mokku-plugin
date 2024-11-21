import { notifications } from "@mantine/notifications";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { storeActions } from "../service/storeActions";
import { useGlobalStore } from "../store/useGlobalStore";
import { useChromeStore, useChromeStoreState } from "../store/useMockStore";
import { IMockResponse } from "../types/mock";

const useMockStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  setStoreProperties: state.setStoreProperties,
  setSelectedMock: state.setSelectedMock,
});

export const useMockActions = () => {
  const { store, setSelectedMock, setStoreProperties } = useChromeStore(
    useMockStoreSelector,
    shallow
  );
  const tab = useGlobalStore((state) => state.meta.tab);

  const getMocksByGroup = useCallback(
    (groupId: string) => {
      return storeActions.getMocksByGroup(store, groupId);
    },
    [store.mocks]
  );

  const isActiveGroupByMock = useCallback(
    (mock: IMockResponse) => {
      return storeActions.isActiveGroupByMock(store, mock);
    },
    [store.groups]
  );

  const toggleMock = useCallback(
    (mockToBeUpdated: IMockResponse) => {
      const updatedStore = storeActions.updateMocks(store, mockToBeUpdated);
      const mockStatus = mockToBeUpdated.active ? "is enabled" : "is disabled";
      storeActions
        .updateStoreInDB(updatedStore)
        .then(setStoreProperties)
        .then(() => {
          storeActions.refreshContentStore(tab.id);
          notifications.show({
            title: `"${mockToBeUpdated.name}" is ${mockStatus}`,
            message: `Mock ${mockStatus}`,
          });
        })
        .catch(() => {
          notifications.show({
            title: "Cannot updated mock.",
            message: "Something went wrong, unable to update mock.",
            color: "red",
          });
        });
    },
    [store, setStoreProperties]
  );
  const deleteMock = useCallback(
    (mockToBeDeleted: IMockResponse) => {
      const updatedStore = storeActions.deleteMocks(store, mockToBeDeleted.id);

      storeActions
        .updateStoreInDB(updatedStore)
        .then(setStoreProperties)
        .then(() => {
          storeActions.refreshContentStore(tab.id);
          notifications.show({
            title: `"${mockToBeDeleted.name}" mock deleted`,
            message: `Mock "${mockToBeDeleted.name}" is deleted successfully.`,
          });
        })
        .catch((error) => {
          console.log(error);
          notifications.show({
            title: "Cannot delete mock.",
            message:
              "Something went wrong, unable to delete mock. Check console for error.",
            color: "red",
          });
        });
    },
    [store, setStoreProperties]
  );
  const duplicateMock = useCallback(
    (mock: IMockResponse) => {
      setSelectedMock({ ...mock, id: undefined });
    },
    [setSelectedMock]
  );

  const editMock = useCallback(
    (mock: IMockResponse) => {
      setSelectedMock(mock);
    },
    [setSelectedMock]
  );

  return {
    getMocksByGroup,
    isActiveGroupByMock,
    toggleMock,
    deleteMock,
    duplicateMock,
    editMock,
  };
};
