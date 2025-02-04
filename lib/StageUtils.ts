import {StageStatusEnum} from '../interfaces/stageStatus.enum';
import {CurrentApplicationInterface} from '../interfaces/application.interface';

export class StageUtils {
  static getStageStateBasedOnArray(relatedStagesStatuses: StageStatusEnum[]) {
    if (relatedStagesStatuses.every(item => item === StageStatusEnum.EMPTY)) {
      return StageStatusEnum.EMPTY;
    } else if (
      relatedStagesStatuses.every(item => item === StageStatusEnum.LOCKED)
    ) {
      return StageStatusEnum.LOCKED;
    } else if (
      relatedStagesStatuses.some(item => item === StageStatusEnum.FINISH)
    ) {
      return StageStatusEnum.FINISH;
    } else if (
      relatedStagesStatuses.some(item => item === StageStatusEnum.ERROR)
    ) {
      return StageStatusEnum.ERROR;
    } else {
      return StageStatusEnum.EMPTY;
    }
  }

  static getApplicationStageState(
    application,
    stageName: string,
  ): [boolean | string, boolean] {
    const selection = application?.stages.find(
      item => item.stageType === stageName,
    );
    if (selection && selection.state) {
      return [selection.state, selection.isEnabled];
    } else {
      return [false, false];
    }
  }

  static getStageStatus(
    isInError: boolean,
    [stageState, isEnabled]: [boolean | string, boolean],
  ) {
    if (isInError) {
      return StageStatusEnum.ERROR;
    } else if (stageState && stageState === 'FILLED') {
      return StageStatusEnum.FINISH;
    } else if ((stageState && stageState === 'EMPTY') && !isEnabled) {
      return StageStatusEnum.LOCKED_EMPTY;
    } else if ((stageState && stageState === 'LOCKED') || !isEnabled) {
      return StageStatusEnum.LOCKED;
    }
    return StageStatusEnum.EMPTY;
  }

  static stageStateGenerator(
    key: string,
    application: CurrentApplicationInterface | undefined,
    contains: Array<string> | undefined,
  ): [StageStatusEnum, boolean] {
    const mapObjectErrorsItem = application?.errors.items
      .filter(item => item.state !== 'FIXED')
      .reduce((obj, item) => ({ ...obj, [item.stage]: true }), {});

    if (!contains || contains.length === 0) {
      const stageState = StageUtils.getApplicationStageState(application, key);
      return [
        StageUtils.getStageStatus(mapObjectErrorsItem[key], stageState),
        stageState[1],
      ];
    } else {
      const relatedStagesStatuses: Array<StageStatusEnum> = [];
      const relatedStagesEnableStatus: Array<boolean> = [];
      contains.forEach(stageName => {
        const stageState = StageUtils.getApplicationStageState(
          application,
          stageName,
        );
        relatedStagesEnableStatus.push(stageState[1]);
        const status = StageUtils.getStageStatus(
          mapObjectErrorsItem[stageName],
          stageState,
        );
        relatedStagesStatuses.push(status);
      });
      const isEnabled = relatedStagesEnableStatus.some(item => item);
      const stageStateBasedOnArray = StageUtils.getStageStateBasedOnArray(
        relatedStagesStatuses,
      );
      return [stageStateBasedOnArray, isEnabled];
    }
  }
}
