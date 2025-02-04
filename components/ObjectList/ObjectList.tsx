import React, { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useRouter } from 'next/router';
import style from './ObjectList.scss';
import { ObjectItem } from './ObjectItem/ObjectItem';
import { FormConfigInterface } from '../../interfaces/stage.interface';
import Button from '../Button/Button';
import { dataMapper } from '../Register/dataMapper';
import {
  configurableRequest,
  injectIntoString,
} from '../../lib/configurableRequest';
import { ObjectUtils } from '../../lib/ObjectUtils';
import { RequestInstance } from '../../store/request';
import { ErrorUtils } from '../../lib/errorUtils';
import DeleteConfirmationModal from '../confirmationModal/deleteConfirmationModal';

export type ObjectListType = Array<Record<string, any>>;

export interface ObjectListProps {
  value?: ObjectListType;
  onChange?: (value: ObjectListType) => void;
  onBlur?: () => void;
  inputName: string;
  title: string;
  error?: string;
  disabled?: boolean;
  extraConfig?: Record<string, any>;
  extraData?: Record<string, any>;
}

export default function ObjectList({
  extraConfig,
  extraData,
  value,
  onChange,
  onBlur,
  title,
  error,
}: ObjectListProps) {
  const [dataList, setDataList] = useState(value || []);
  const [isUpdate, toggleIsUpdate] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [addItemModalVisibility, setAddItemModalVisibility] = useState(false);
  const [itemId, setItemId] = useState<any>();
  const [itemData, setItemData] = useState<Record<string, any>>({});
  const router = useRouter();

  const showEdit = useMemo(() => !extraConfig?.hideEdit, [extraConfig]);
  const showDelete = useMemo(() => !extraConfig?.hideDelete, [extraConfig]);

  function uuidGenerator() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function(c) {
        // eslint-disable-next-line no-bitwise
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        // eslint-disable-next-line no-bitwise
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
    return uuid;
  }

  useEffect(() => {
    makeFieldDirty();
    if (onChange) {
      onChange(dataList);
    }
  }, [dataList]);

  function makeFieldDirty() {
    if (onBlur) {
      onBlur();
    }
  }

  function getItemTitle(item: Record<string, any>): string {
    return injectIntoString(extraConfig?.itemTitle, router, item);
  }

  function getItemDescription(item: Record<string, any>): string {
    return injectIntoString(extraConfig?.itemDescription, router, item);
  }

  function openAddItemModal() {
    setAddItemModalVisibility(true);
    toggleIsUpdate(false);
  }

  function closeAddItemModal() {
    setItemData({});
    setAddItemModalVisibility(false);
  }

  async function submitItem(data: Record<string, any>) {
    const { mappedData } = dataMapper(
      data,
      extraConfig?.formConfig?.map.toService,
    );
    const duplicatedItem = dataList.find(
      item => getItemUniqValue(item) === getItemUniqValue(mappedData),
    );
    let item = null;

    if (
      extraConfig?.checkItemUniqueness &&
      ObjectUtils.checkIfItsFilled(duplicatedItem)
    ) {
      const itemTitle = getItemTitle(duplicatedItem as Record<string, any>);
      return `خطا؛ این مورد قبلا با عنوان «${itemTitle}» ثبت شده است.`;
    } else if (extraConfig?.actions?.add) {
      try {
        item = await configurableRequest(
          RequestInstance,
          extraConfig?.actions?.add,
          router,
          mappedData,
        );
      } catch (exception) {
        const errorCode =
          exception.response?.data?.status || exception.response?.status;
        const errorMessage = ErrorUtils.getErrorMessage(
          exception.response?.data?.exceptionMessage || errorCode,
        );
        return extraConfig?.itemRejectionMessage || errorMessage;
      }
    }
    setDataList([
      ...dataList,
      Object.assign(mappedData, item, { id: uuidGenerator() }),
    ]);
    closeAddItemModal();
    setItemData({});
  }

  async function updateItem(data) {
    const mappedItemData = dataMapper(
      itemData,
      extraConfig?.formConfig?.map.toService,
    ).mappedData;

    let item = null;
    if (extraConfig?.actions?.update) {
      try {
        const { mappedData } = dataMapper(
          data,
          extraConfig?.formConfig?.map.toService,
        );
        item = await configurableRequest(
          RequestInstance,
          extraConfig?.actions?.update,
          router,
          mappedData,
        );
      } catch (exception) {
        const errorCode =
          exception.response?.data?.status || exception.response?.status;
        const errorMessage = ErrorUtils.getErrorMessage(
          exception.response?.data?.exceptionMessage || errorCode,
        );
        return extraConfig?.itemRejectionMessage || errorMessage;
      }
    }

    // eslint-disable-next-line no-shadow
    const editItem = Object.assign(
      dataMapper(data, extraConfig?.formConfig?.map.toService).mappedData,
      { id: itemId.id },
    );

    setDataList(
      // eslint-disable-next-line no-shadow
      dataList.map(item =>
        item.id === editItem.id ? { ...item, ...editItem } : item,
      ),
    );

    // setDataList(updatedList);
    closeAddItemModal();
    toggleIsUpdate(false);
    setItemData({});
  }

  function editItem(item) {
    setItemId(item);
    toggleIsUpdate(true);
    const mappedData = dataMapper(item, extraConfig?.formConfig?.map.toStore);
    setItemData(mappedData.mappedData);
    setAddItemModalVisibility(true);
  }

  async function deleteItem(item) {
    if (extraConfig?.actions?.delete) {
      try {
        await configurableRequest(
          RequestInstance,
          extraConfig?.actions?.delete,
          router,
          item,
        );
      } catch (exception) {
        return false;
      }
    }

    const itemUniqValue = getItemUniqValue(item);

    const filteredList = dataList.filter(listItem => {
      return getItemUniqValue(listItem) !== itemUniqValue;
    });

    setDataList(filteredList);
    setShowConfirmationModal(false);
  }

  function getItemUniqValue(item: Record<string, any>): string {
    if (item.hasOwnProperty(extraConfig?.itemUniqField)) {
      // return item[extraConfig?.itemUniqField]?.toString();
      return item?.id?.toString();
    } else {
      return item.id?.toString();
    }
  }

  function getStatus(data: Record<string, any>) {
    if (extraConfig?.status) {
      const statusValue = data.hasOwnProperty(extraConfig?.status?.field)
        ? data[extraConfig?.status?.field]
        : '';
      const mapItem = extraConfig?.status?.map.find(
        item => item.value === statusValue,
      );
      

    console.log(extraConfig?.status)
      return (
        <></>
        // <span className={`item-status`}>{mapItem.label}</span>
      );
    }
  }

  const onCloseDeleteModal = () => {
    setItemData({});
    setShowConfirmationModal(false);
  };

  const openConfirmationModal = item => {
    setItemData(item);
    setShowConfirmationModal(true);
  };



  const listItems = useMemo(
    () =>
      dataList.map((item, index) => (
        <div className={style.listItem} key={getItemUniqValue(item)}>
          <div className={style.listItemFirstColumn}>
            <span className={style.itemTitle}>{getItemTitle(item)}</span>
            {/*<span className={style.itemDescription}>*/}
            {/*  {getItemDescription(item)}*/}
            {/*</span>*/}
          </div>
          <div className={style.listItemSecondColumn}>
            <div className={style.actionsContainer}>
              <div className={style.icons}>
                {showEdit && (
                  <div
                    onClick={() => editItem(item)}
                    className={style.editContainer}
                  >
                    <EditOutlined />
                  </div>
                )}
                {showDelete && (
                  <div
                    onClick={() => openConfirmationModal(item)}
                    className={style.deleteContainer}
                  >
                    <DeleteOutlined />
                  </div>
                )}
              </div>
            </div>
            <div className={style.statusContainer}>{getStatus(item)}</div>
          </div>
        </div>
      )),
    [dataList],
  );

  return (
    <div className={style.container}>
      <span className={style.title}>{title}</span>
      <div className={style.listContainer}>{listItems}</div>
      <Button
        type="default"
        onClick={openAddItemModal}
        loading={false}
        className={style.button}
      >
        + اضافه کردن
      </Button>
      {error && <span className={style.errorMessage}>{error}</span>}
      <Modal
        className={style.modal}
        title="Basic Modal"
        visible={addItemModalVisibility}
        onCancel={closeAddItemModal}
        centered
        footer={null}
      >
        {addItemModalVisibility && (
          <ObjectItem
            onClose={closeAddItemModal}
            onSubmit={isUpdate ? updateItem : submitItem}
            data={itemData}
            extraData={extraData}
            formConfig={extraConfig?.formConfig as FormConfigInterface}
          />
        )}
      </Modal>
      <DeleteConfirmationModal
        onConfirm={() => deleteItem(itemData)}
        show={showConfirmationModal}
        onClose={onCloseDeleteModal}
        title="حذف"
        description="برای تایید، کلمه‌ی حذف را در کادر زیر تایپ
        کنید"
      />
    </div>
  );
}
