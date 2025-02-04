/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable no-nested-ternary */

import React, { forwardRef, memo, useMemo } from 'react';
import style from './schemas/schema.scss';

import Table from './schemas/table';
import {
  paragraphWithThreeDots,
  useParagraphWithHandleQuestions,
} from './schemas/paragraph/index';

const signUrlImg = '../../static/images/IMG.png';

interface ContractsInterface {
  dataContract: any;
  // eslint-disable-next-line react/require-default-props
  isPdfModalVisible?: boolean;
  // eslint-disable-next-line react/require-default-props
  isConfirm?: boolean;
  // eslint-disable-next-line react/require-default-props
  formDocValueOneRender?: any;
  // eslint-disable-next-line react/require-default-props
  imgUrl?: any;
  // eslint-disable-next-line react/require-default-props
  isLoading?: any;
  // eslint-disable-next-line react/require-default-props
  contractItem?: any;
  brand?: string;
}

const ContractsList = forwardRef(
  (
    {
      brand,
      dataContract,
      isPdfModalVisible,
      isConfirm,
      formDocValueOneRender,
      imgUrl,
      isLoading,
      contractItem,
    }: ContractsInterface,
    ref: any,
  ) => {
    console.log(contractItem, 'dataContract');
    const signRender = useMemo(() => {
      if (imgUrl) {
        const base64Image = imgUrl.split(';base64,').pop();
        const decode = atob(base64Image);
        const byteNumbers = new Array(decode.length);
        for (let i = 0; i < decode.length; i++) {
          byteNumbers[i] = decode.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blobimg = new Blob([byteArray]);

        const url = URL.createObjectURL(blobimg);
        return (
          <div>
            <img src={url} alt="sign" className={style.signitureImage} />
          </div>
        );
      }
    }, [imgUrl]);

    return (
      <>
        {isPdfModalVisible && (
          <div className={style.container} ref={ref}>
            <div className={style.pageA4}>
              {dataContract?.map((e, idx) =>
                e.pages?.map(page => {
                  return (
                    <div
                      className={style.pageContent}
                      style={{
                        marginBottom: '7px',
                        marginTop: '5px',
                        height: isConfirm ? '295mm' : 'auto',
                        border: !isConfirm ? '2px solid black' : '',
                      }}
                    >
                      {page?.entities?.map(item => {
                        return (
                          <div>
                            {item.id !== 'table' ? (
                              item.bold || item.contractTitle ? (
                                <div className={style.itemText}>
                                  {item.text}
                                </div>
                              ) : item.description ? (
                                <div className={style.itemDescription}>
                                  {item.textltr ? item.textltr : item.text}
                                </div>
                              ) : item.title ? (
                                <div className={style.itemTitle}>
                                  {item.text}
                                </div>
                              ) : (
                                <div className={style.text}>
                                  {!item.regex ? (
                                    <>
                                      {item.textltr ? item.textltr : item.text}
                                    </>
                                  ) : (
                                    <>
                                      {paragraphWithThreeDots(
                                        item,
                                        formDocValueOneRender,
                                        isLoading,
                                      )}
                                    </>
                                  )}
                                </div>
                              )
                            ) : (
                              <Table
                                tableArray={item?.table}
                                data={formDocValueOneRender}
                              />
                            )}
                          </div>
                        );
                      })}
                      {useParagraphWithHandleQuestions(page.entities)}

                      {brand !== 'IRANCR' &&
                        contractItem.name !== 'formDocSix' && (
                          <div id="sign" className={style.sign}>
                            <div className={style.signitureContainerText}>
                              <div>امضاومهر کارگزاری</div>
                              <div>امضاومهر مشتری</div>
                            </div>
                            <div className={style.signitureContainerImg}>
                              <div className={style.signContainer}>
                                {contractItem.name ===
                                  'formKhobreganMerged' && (
                                  <img
                                    src="/static/images/IMG.png"
                                    alt="IMG.png"
                                    className={style.signitureImage}
                                  />
                                )}
                              </div>
                              <div>{signRender}</div>
                            </div>
                          </div>
                        )}

                      {contractItem.name === 'formDocSix' && (
                        <div style={{ display: 'flex' }}>
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <div>نام مشتری :</div>
                            <div>تاریخ :</div>
                            <div> اثر انگشت / مهر :</div>
                            <div>امضا</div>
                          </div>
                          <div>عضو شرکت کارگزاری توسعه معاملات کیان امضا</div>
                        </div>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        )}
      </>
    );
  },
);

export default memo(ContractsList);
