import { FC } from 'react';
import styled from 'styled-components';

interface IStepProcessProps {
    stepNumber: number;
}

type StepProps = {
    stepNumber: number;
};

const Step = styled.div`
    width: 100%;
    height: 2px;
    background-color: #222222;
    width: ${(props: StepProps) => 'calc(100% / 11' + `* ${props.stepNumber})`};
`;

const StepProcess: FC<IStepProcessProps> = ({ stepNumber }) => {
    return (
        <Step
            stepNumber={stepNumber}
            style={
                stepNumber === 4
                    ? {
                          position: 'absolute',
                          zIndex: 101,
                          bottom: '79px',
                      }
                    : {}
            }
        />
    );
};

export default StepProcess;
