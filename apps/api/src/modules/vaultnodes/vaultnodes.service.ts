import { repo } from "./vaultnodes.repo";

export const service = {
  create: repo.create,
  list: repo.list,
  get: repo.get,
  update: repo.update,
  delete: repo.delete
};
