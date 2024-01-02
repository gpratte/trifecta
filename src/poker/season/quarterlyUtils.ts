export function quarterlyName(value: string) : string {
  switch (value) {
    case "FIRST":
      return '1st Quarter';
    case "SECOND":
      return '2nd Quarter';
    case "THIRD":
      return '3rd Quarter';
    default:
      return '4th Quarter';
  }
}
