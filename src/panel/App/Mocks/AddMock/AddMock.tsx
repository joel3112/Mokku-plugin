import React from "react";
import { SideDrawer } from "../../Blocks/SideDrawer";
import { useChromeStore, useChromeStoreState } from "../../store/useMockStore";
import { AddMockForm } from "./AddMock.Form";

const useMockStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  selectedMock: state.selectedMock,
  setSelectedMock: state.setSelectedMock,
  setStoreProperties: state.setStoreProperties,
});

export const AddMock = ({ onClose }: { onClose: () => void }) => {
  const {
    store,
    selectedMock,
    setSelectedMock,
    setStoreProperties,
  } = useChromeStore(useMockStoreSelector);

  return (
    <SideDrawer minWidth={480}>
      <AddMockForm
        key={`${selectedMock.id}-${selectedMock.url}`}
        store={store}
        selectedMock={selectedMock}
        setSelectedMock={setSelectedMock}
        setStoreProperties={setStoreProperties}
        onClose={onClose}
      />
    </SideDrawer>
  );
};
