import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { RootState } from '../../store/rootReducer';
import { ObjectUtils } from '../../lib/ObjectUtils';
import { BoxCardDto } from '../../interfaces/card.interface';

export const BOX_STATUS_MAP = {
  WAITING: 'pending',
  IN_PROGRESS: 'in-progress',
  NOT_FOUND: 'not-found',
  DONE: 'done',
};

function useFlowState(): BoxCardDto | undefined {
  const { data: card, loading, error } = useSelector(
    ({ card: cardStore }: RootState) => cardStore,
  );
  const router = useRouter();
  const { flowId } = router.query;
  const currentBoxId = card?.currentBoxId;
  const cardId = card?.cardId;

  const currentBox = useMemo(() => {
    return card?.boxDtos?.find(item => item.boxId === currentBoxId);
  }, [card]);

  useEffect(() => {
    if (currentBox) {
      router.push(
        '/flow/[flowId]/[cardId]/[step]',
        `/flow/${flowId}/${cardId}/${
          BOX_STATUS_MAP[currentBox.boxStatus as string]
        }`,
      );
    } else if (!loading && error && !ObjectUtils.checkIfItsFilled(card)) {
      router.push(
        '/flow/[flowId]/[cardId]/[step]',
        `/flow/${flowId}/${cardId}/${BOX_STATUS_MAP.NOT_FOUND}`,
      );
    }
  }, [card]);

  return currentBox;
}

export default useFlowState;
