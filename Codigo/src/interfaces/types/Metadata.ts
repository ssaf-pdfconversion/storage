export default interface Metadata {
  transaction: Transaction;
}

interface Transaction {
  timestampQuery: string;
  conversions: Conversion[];
}

interface Conversion {
  userId: number;
  size: number;
  fileTypeId: number;
  conversionTimestamp: string;
  conversionStatus: boolean;
  iterations: Iteration[];
}

interface Iteration {
  initialTimestamp: string;
  conversionSuccess: boolean;
  message: string;
  returnTimestamp: string;
  nodeId: string;
}
