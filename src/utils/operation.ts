type IdleValue = {
  type: "Idle";
};

type RunningValue = {
  type: "Running";
};

type SuccessValue<T> = {
  type: "Success";
  value: T;
};

type ErrorValue = {
  type: "Error";
  error: Error;
};

export type Operation<T = void> = IdleValue | RunningValue | SuccessValue<T> | ErrorValue;

export const idle: IdleValue = { type: "Idle" };
export const running: RunningValue = { type: "Running" };
export const success = <T>(value: T): SuccessValue<T> => ({ type: "Success", value });
export const error = (e: Error): ErrorValue => ({
  type: "Error",
  error: e,
});

export const isIdle = <T>(op: Operation<T>): op is IdleValue => op.type === "Idle";
export const isRunning = <T>(op: Operation<T>): op is RunningValue => op.type === "Running";
export const isSuccess = <T>(op: Operation<T>): op is SuccessValue<T> => op.type === "Success";
export const isError = <T>(op: Operation<T>): op is ErrorValue => op.type === "Error";

export const join = <T, S>(
  f: {
    Idle: () => S;
    Running: () => S;
    Success: (value: T) => S;
    Error: (err: Error) => S;
  },
  op: Operation<T>
): S => {
  switch (op.type) {
    case "Idle":
      return f.Idle();
    case "Running":
      return f.Running();
    case "Success":
      return f.Success(op.value);
    case "Error":
      return f.Error(op.error);
    default:
      return op satisfies never;
  }
};

export const getValue = <T>(op: Operation<T>): T | undefined =>
  join(
    {
      Idle: () => undefined,
      Running: () => undefined,
      Success: (value: T) => value,
      Error: () => undefined,
    },
    op
  );

export const getError = <T>(op: Operation<T>): Error | undefined =>
  join(
    {
      Idle: () => undefined,
      Running: () => undefined,
      Success: () => undefined,
      Error: (err) => err,
    },
    op
  );
