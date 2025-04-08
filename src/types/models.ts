export interface Customer {
  id: number;
  name: string;
  projects: Project[];
}

export interface Project {
  id: number;
  name: string;
  customerId: number;
  customer: Customer;
  sites: Site[];
}

export interface Site {
  customerId: number;
  id: number;
  name: string;
  projectId: number;
  project?: Project;
  buildings?: Building[];
}

export interface Building {
  id: number;
  name: string;
  siteId: number;
  customerId: number;
  customer?: Customer;
  site?: Site;
  floors?: Floor[];
}

export interface Floor {
  id: number;
  name: string;
  customerId: number;
  customer?: Customer;
  buildingId: number;
  building?: Building;
  zones: Zone[];
}

export interface NetworkRoom {
  id: number;
  name: string;
  floorId: number;
  customerId: number;
  tilesWidth: number;
  tilesLength: number;
  floor: Floor;
  customer?: Customer;
}

export interface MeetMeRoom {
  id: number;
  name: string;
  floorId: number;
  customerId: number;
  tilesWidth: number;
  tilesLength: number;
  floor?: Floor;
  customer?: Customer;
}

export interface DataHall {
  floorId: number | null;
  tilesLength: number;
  tilesWidth: number;
  floor?: Floor;
  id: number;
  name: string;
  zones?: Zone[];
}

// Generated Types
export interface ZoneType {
  id: number;
  name: string;
  description: string;
  customerId: number;
  dataHallId: number;
}

export interface Zone {
  id: number;
  name: string;
  numberOfScalableUnits: number;
  numberOfRacks: number;
  numberOfTilesBetweenScalableUnitRows: number;
  numberOfTilesBetwenScalableUnits: number;
  networkCabinets: NetworkCabinet[];
  patchPanels: PatchPanel[];
  fiberTrunkCables: FiberTrunkCable[];
  cables: Cable[];
  racks: Rack[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  zoneType: ZoneType;
  zoneTypeId: number;
}

export interface ScalableUnitZone {
  id: number;
  name: string;
  numberOfT1NetworkRacks: number;
  numberOfGpuRacks: number;
  numberOfRows: number;
  numberOfTilesBetweenScalableUnitRows: number;
  numberOfTilesBetwenScalableUnits: number;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface StorageUnitZone {
  id: number;
  name: string;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface SuperSpineZone {
  id: number;
  name: string;
  racks: Rack[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface SpineLeafZone {
  id: number;
  name: string;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface RackType {
  id: number;
  name: string;
  racks: Rack[];
}
export interface Rack {
  id: number;
  name: string;
  gpuComputeRacks: GpuComputeRack[];
  cpuComputeRacks: CpuComputeRack[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  zone?: Zone;
  zoneId?: number;
  superSpineZone?: SuperSpineZone;
  superSpineZoneId?: number;
  rackTypeId: number;
  RackType: RackType;
}
export interface RackUnit {
  id: number;
  name: string;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface NetworkSwitch {
  id: number;
  name: string;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  networkCabinet?: NetworkCabinet;
  networkCabinetId?: number;
  gpuComputeRack?: GpuComputeRack;
  gpuComputeRackId?: number;
  cpuComputeRack?: CpuComputeRack;
  cpuComputeRackId?: number;
  leafSwitchRack?: LeafSwitchRack;
  leafSwitchRackId?: number;
  spineLeafSwitchRack?: SpineLeafSwitchRack;
  spineLeafSwitchRackId?: number;
  superSpineSwitchRack?: SuperSpineSwitchRack;
  superSpineSwitchRackId?: number;
}
export interface FiberTrunkCable {
  id: number;
  name: string;
  fiberCableType: string;
  fiberTrunkCableCoreCount: string;
  fiberTrunkCableSerialID: string;
  fireRating: string;
  numberOfFiberCoresPerConnector: number;
  fibersPerSubUnit: number;
  numberOfSubUnitsPerCable: number;
  fiberTrunkCableDiameter: number;
  numberOfLegsInTrunk: number;
  lengthOfLegBreakout: number;
  apcConnector: boolean;
  legLabelnumber: string;
  cableLength: number;
  redundantFiberFeeds: boolean;
  deliveredToProject: boolean;
  cablePulled: boolean;
  cablePlugged: boolean;
  cableTested: boolean;
  fiberTrunkCableLegs: FiberTrunkCableLeg[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  networkCabinet?: NetworkCabinet;
  networkCabinetId?: number;
  patchPanelModulePort?: PatchPanelModulePort;
  patchPanelModulePortId?: number;
  zone?: Zone;
  zoneId?: number;
  gpuComputeRack?: GpuComputeRack;
  gpuComputeRackId?: number;
  cpuComputeRack?: CpuComputeRack;
  cpuComputeRackId?: number;
  leafSwitchRack?: LeafSwitchRack;
  leafSwitchRackId?: number;
  spineLeafSwitchRack?: SpineLeafSwitchRack;
  spineLeafSwitchRackId?: number;
  superSpineSwitchRack?: SuperSpineSwitchRack;
  superSpineSwitchRackId?: number;
}
export interface FiberTrunkCableLeg {
  id: number;
  nameAside: string;
  nameBside: string;
  sideAInstalledOnLeft: boolean;
  sideBInstalledOnLeft: boolean;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  fiberTrunkCable?: FiberTrunkCable;
  fiberTrunkCableId?: number;
  patchPanelModulePort?: PatchPanelModulePort;
  patchPanelModulePortId?: number;
}
export interface Gpu {
  id: number;
  name: string;
  numberFiberPortsPerGPU: number;
  numberFiberPortsPerGPUFrontSide: number;
  fiberPortsPerGPURearSide: number;
  powerPerGPU: number;
  gpuType: string;
  gpuCost: number;
  gpuFrontSide: GpuFrontSide[];
  gpuRearSide: GpuRearSide[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  server: Server;
  serverId: number;
}
export interface FiberTransceiverType {
  id: number;
  name: string;
  transceiverType: string;
  transceiverPowerDraw: number;
  transceiverCost: number;
  location: string;
  isInGpu: boolean;
  isInCPU: boolean;
  isInLeafSwitch: boolean;
  isInSpineSwitch: boolean;
  isInSuperSpineSwitch: boolean;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface GpuPort {
  id: number;
  name: string;
  location: string;
  Customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  gpuFrontSide?: GpuFrontSide;
  gpuFrontSideId?: number;
  gpuRearSide?: GpuRearSide;
  gpuRearSideId?: number;
}
export interface PatchPanel {
  id: number;
  name: string;
  patchPanelPresent: boolean;
  patchPanelTypeFiberOrCopper: string;
  numberofRusPerPatchPanelType: number;
  numberofPatchPanelPorts: number;
  locatedInRUNumber: number;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  networkCabinet?: NetworkCabinet;
  networkCabinetId?: number;
  zone?: Zone;
  zoneId?: number;
  gpuComputeRack?: GpuComputeRack;
  gpuComputeRackId?: number;
  cpuComputeRack?: CpuComputeRack;
  cpuComputeRackId?: number;
  leafSwitchRack?: LeafSwitchRack;
  leafSwitchRackId?: number;
  spineLeafSwitchRack?: SpineLeafSwitchRack;
  spineLeafSwitchRackId?: number;
  superSpineSwitchRack?: SuperSpineSwitchRack;
  superSpineSwitchRackId?: number;
}
export interface PatchPanelPort {
  id: number;
  name: string;
  locatedInRUNumber: number;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface OcpRack {
  id: number;
  rackHeightInRackUnits: number;
  rackWidthInMm: number;
  containsFiberPatchPanel: boolean;
  containsCopperPatchPanel: boolean;
  numberOfFiberPatchPanels: number;
  numberOfCopperPatchPanels: number;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface Server {
  id: number;
  name: string;
  deviceModelName: string;
  deviceHostName: string;
  deviceHostNameNumberStart: number;
  deviceHostNameNumberEnd: number;
  numberOfGpusPerServer: number;
  serverRackUnitSize: number;
  serverWidth: string;
  serverDepth: string;
  serverCost: number;
  totalNumberOfFiberPortsPerServer: number;
  totalNumberOfCopperPortsPerServer: number;
  numberOfBackendPorts: number;
  backendTransceiverType: string;
  numberOfFrontendMgmtPorts: number;
  frontendTransceiverType: string;
  numberOfOutOfBandPorts: number;
  outOfBandType: string;
  numberOfStorageMgmtPorts: number;
  storageTransceiverType: string;
  gpu: Gpu[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  gpuComputeRack?: GpuComputeRack;
  gpuComputeRackId?: number;
}
export interface CpuComputeRack {
  id: number;
  name: string;
  containsFiberPatchPanel: boolean;
  containsCopperPatchPanel: boolean;
  numberOfFiberPatchPanels: number;
  numberOfCopperPatchPanels: number;
  numberOfServersPerRack: number;
  powerLimitPerRack: number;
  powerFeedActive: boolean;
  temperatureFeedActive: boolean;
  waterLeakDetectionActive: boolean;
  doorAccessSensorActive: boolean;
  patchPanels: PatchPanel[];
  cables: Cable[];
  fiberTrunkCables: FiberTrunkCable[];
  networkSwitches: NetworkSwitch[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  rack?: Rack;
  rackId?: number;
}
export interface GpuComputeRack {
  id: number;
  name: string;
  numberOfServersPerRack: number;
  powerLimitPerGpuComputeRack: number;
  containsFiberPatchPanel: boolean;
  containsCopperPatchPanel: boolean;
  numberOfFiberPatchPanels: number;
  numberOfCopperPatchPanels: number;
  powerFeedActive: boolean;
  temperatureFeedActive: boolean;
  waterLeakDetectionActive: boolean;
  doorAccessSensorActive: boolean;
  patchPanels: PatchPanel[];
  cables: Cable[];
  fiberTrunkCables: FiberTrunkCable[];
  networkSwitches: NetworkSwitch[];
  servers: Server[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  rack?: Rack;
  rackId?: number;
}
export interface LeafSwitch {
  id: number;
  nameOfSwitch: string;
  sizeInNumberOfRackUnits: number;
  switchRuLocationStart: number;
  widthInMm: number;
  depthInMm: number;
  totalNumberOfFiberGbicPorts: number;
  numberOfFiberPortsPerGbic: number;
  transceiverType: string;
  numberOfFiberPortsToGpu: number;
  numberOfFiberPortsToSpineSwitch: number;
  powerConsumptionWatts: number;
  cost: number;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  leafSwitchRack?: LeafSwitchRack;
  leafSwitchRackId?: number;
}
export interface LeafSwitchPort {
  id: number;
  nameOfFiberPortsToGpu: string;
  nameOfFiberPortsToSpine: string;
  sideAInstalledOnLeft: boolean;
  sideBInstalledOnLeft: boolean;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface SpineLeafSwitch {
  id: number;
  nameOfSwitch: string;
  sizeInNumberOfRackUnits: number;
  switchRuLocationStart: number;
  widthInMm: number;
  depthInMm: number;
  totalNumberOfFiberGbicPorts: number;
  numberOfFiberPortsPerGbic: number;
  transceiverType: string;
  numberOfFiberPortsToLeafSwitch: number;
  numberOfFiberPortsToSuperSpineSwitch: number;
  powerConsumptionWatts: number;
  cost: number;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface SpineSwitchPort {
  id: number;
  nameOfFiberPortsToLeaf: string;
  nameOfFiberPortsToSuperSpine: string;
  sideAInstalledOnLeft: boolean;
  sideBInstalledOnLeft: boolean;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface SuperSpineLeafSwitch {
  id: number;
  nameOfSwitch: string;
  sizeInNumberOfRackUnits: number;
  switchRuLocationStart: number;
  widthInMm: number;
  depthInMm: number;
  totalNumberOfFiberGbicPorts: number;
  numberOfFiberPortsPerGbic: number;
  transceiverType: string;
  numberOfFiberPortsToSpineSwitch: number;
  numberOfFiberPortsToNetworkRoom: number;
  powerConsumptionWatts: number;
  cost: number;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface SuperSpineSwitchPort {
  id: number;
  nameOfFiberPortsToSpine: string;
  nameOfFiberPortsToNetworkRoom: string;
  sideAInstalledOnLeft: boolean;
  sideBInstalledOnLeft: boolean;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface LeafSwitchRack {
  id: number;
  name: string;
  containsFiberPatchPanel: boolean;
  containsCopperPatchPanel: boolean;
  numberOfFiberPatchPanels: number;
  numberOfCopperPatchPanels: number;
  numberOfLeafSwitchesPerRack: number;
  patchPanels: PatchPanel[];
  networkCabinets: NetworkCabinet[];
  cables: Cable[];
  fiberTrunkCables: FiberTrunkCable[];
  networkSwitchs: NetworkSwitch[];
  leafSwitchs: LeafSwitch[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface SpineLeafSwitchRack {
  id: number;
  name: string;
  containsFiberPatchPanel: boolean;
  containsCopperPatchPanel: boolean;
  numberOfFiberPatchPanels: number;
  numberOfCopperPatchPanels: number;
  numberOfSpineSwitchesPerRack: number;
  patchPanels: PatchPanel[];
  networkCabinets: NetworkCabinet[];
  cables: Cable[];
  fiberTrunkCables: FiberTrunkCable[];
  networkSwitchs: NetworkSwitch[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface SuperSpineSwitchRack {
  id: number;
  name: string;
  containsFiberPatchPanel: boolean;
  containsCopperPatchPanel: boolean;
  numberOfFiberPatchPanels: number;
  numberOfCopperPatchPanels: number;
  numberOfSpineSwitchesPerRack: number;
  patchPanels: PatchPanel[];
  networkCabinets: NetworkCabinet[];
  cables: Cable[];
  fiberTrunkCables: FiberTrunkCable[];
  networkSwitches: NetworkSwitch[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface Containment {
  id: number;
  containmentType: string;
  trayWidth: number;
  trayLength: number;
  trayHeight: number;
  numberOfPathwayLanes: number;
  distanceBetweenRackTypeAndFirstLane: number;
  distanceBetweenEachLaneLevel: number;
  startXCoordinate: number;
  endXCoordinate: number;
  startYCoordinate: number;
  endYCoordinate: number;
  costPerLength: number;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface Cooling {
  id: number;
  coolingType: string;
  coolingAmountPerRack: number;
  kwhConsumptionPerRack: number;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface ConnectivityPath {
  id: number;
  pathName: string;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface NetworkCabinet {
  id: number;
  name: string;
  containsFiberPatchPanel: boolean;
  containsCopperPatchPanel: boolean;
  numberOfFiberPatchPanels: number;
  numberOfCopperPatchPanels: number;
  widthInMm: number;
  heightInMm: number;
  weightInKg: number;
  networkSwitches: NetworkSwitch[];
  patchPanels: PatchPanel[];
  fiberTrunkCables: FiberTrunkCable[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  networkRoom?: NetworkRoom;
  networkRoomId?: number;
  meetMeRoom?: MeetMeRoom;
  meetMeRoomId?: number;
  zone?: Zone;
  zoneId?: number;
  leafSwitchRack?: LeafSwitchRack;
  leafSwitchRackId?: number;
  spineLeafSwitchRack?: SpineLeafSwitchRack;
  spineLeafSwitchRackId?: number;
  superSpineSwitchRack?: SuperSpineSwitchRack;
  superSpineSwitchRackId?: number;
}
export interface Cable {
  id: number;
  cableType: string;
  length: string;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  zone?: Zone;
  zoneId?: number;
  gpuComputeRack?: GpuComputeRack;
  gpuComputeRackId?: number;
  cpuComputeRack?: CpuComputeRack;
  cpuComputeRackId?: number;
  leafSwitchRack?: LeafSwitchRack;
  leafSwitchRackId?: number;
  spineLeafSwitchRack?: SpineLeafSwitchRack;
  spineLeafSwitchRackId?: number;
  superSpineSwitchRack?: SuperSpineSwitchRack;
  superSpineSwitchRackId?: number;
}
export interface PatchPanelModulePort {
  id: number;
  portLocationFrontOrBack: string;
  fiberTrunkCableLegs: FiberTrunkCableLeg[];
  fiberTrunkCables: FiberTrunkCable[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface NetworkType {
  id: number;
  name: string;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  gpuFrontSide?: GpuFrontSide;
  gpuFrontSideId?: number;
  gpuRearSide?: GpuRearSide;
  gpuRearSideId?: number;
}
export interface NetworkTopology {
  id: number;
  name: string;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  gpuFrontSide?: GpuFrontSide;
  gpuFrontSideId?: number;
  gpuRearSide?: GpuRearSide;
  gpuRearSideId?: number;
}
export interface GpuFrontSide {
  id: number;
  name: string;
  gpuPorts: GpuPort[];
  networkTopologies: NetworkTopology[];
  networkTypes: NetworkType[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  gpu: Gpu;
  gpuId: number;
}
export interface GpuRearSide {
  id: number;
  name: string;
  gpuPorts: GpuPort[];
  networkTopologies: NetworkTopology[];
  networkTypes: NetworkType[];
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
  gpu?: Gpu;
  gpuId?: number;
}
export interface NetworkTypeSouth {
  id: number;
  name: string;
  numberOfFiberGbicPorts: number;
  numberOfFiberPortsPerGbic: number;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface ScalableUnitGpuLeafSwitchRack {
  id: number;
  numberOfSwitchesPerRack: number;
  powerLimitPerGpuSwitchRack: number;
  containsFiberPatchPanel: boolean;
  containsCopperPatchPanel: boolean;
  numberOfFiberPatchPanels: number;
  numberOfCopperPatchPanels: number;
  powerFeedActive: boolean;
  temperatureFeedActive: boolean;
  waterLeakDetectionActive: boolean;
  doorAccessSensorActive: boolean;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
export interface LeafSwitchGbicPort {
  id: number;
  nameOfFiberGbic: string;
  numberOfFiberPortsPerGbic: number;
  sideAInstalledOnLeft: boolean;
  sideBInstalledOnLeft: boolean;
  customer: Customer;
  customerId: number;
  dataHall: DataHall;
  dataHallId: number;
}
