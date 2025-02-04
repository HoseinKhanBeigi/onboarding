import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { StepRouteInterface } from '../../interfaces/step-route.Interface';
import { ProductInterface } from '../../interfaces/product.interface';
import { CurrentApplicationInterface } from '../../interfaces/application.interface';
import { StageUtils } from '../../lib/StageUtils';

interface UseStepsInterface {
  product: ProductInterface;
  application?: CurrentApplicationInterface;
}

export default function useSteps({
  product,
  application,
}: UseStepsInterface): Array<StepRouteInterface> {
  const router = useRouter();
  return useMemo(
    () =>
      product.stages.map<StepRouteInterface>(
        ({ name: key, label: title, contains, builtin }) => {
          const [status] = StageUtils.stageStateGenerator(
            key,
            application,
            contains,
          );

          return {
            title,
            key,
            path: `/onboarding/${router.query.product}/${key.toLowerCase()}/${
              router.query.applicationId
            }`,
            status,
            builtin,
          };
        },
      ),
    [product, application],
  );
}
