export type Build = {
  status: string;
  statusText: string;
  finishDate: string;
  startDate: string;
  branchName: string;
  revisions: RevisionsCollection;
};

export type BuildType = {
  id: string;
  name: string;
  status?: string;
  webUrl: string;
  builds: {
    build: Build[];
  }
};

export type RevisionsCollection = {
  revision: Revision[];
};

export type Revision = {
  version: string;
  'vcs-root-instance'?: VCSRootInstance;
};

export type VCSRootInstance = {
  id?: string;
  name: string;
  href?: string;
};

export type DenseTableProps = {
  builds: BuildType[];
};