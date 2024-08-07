import { useState, FC } from "react";
import { useAuth } from "@/services/auth";
import Modal from "@/components/Modal";
import { isCloud } from "@/services/env";

const EditOrganization: FC<{
  onEdit: () => void;
  close?: () => void;
  id: string;
  currentName: string;
  currentExternalId: string;
  currentLicenseKey: string;
  currentOwner: string;
}> = ({
  onEdit,
  close,
  id,
  currentName,
  currentExternalId,
  currentLicenseKey,
  currentOwner,
}) => {
  const [name, setName] = useState(currentName);
  const [owner, setOwner] = useState(currentOwner);
  const [externalId, setExternalId] = useState(currentExternalId);
  const [licenseKey, setLicenseKey] = useState(currentLicenseKey);

  const { apiCall } = useAuth();

  const handleSubmit = async () => {
    await apiCall<{
      status: number;
      message?: string;
    }>("/admin/organization", {
      method: "PUT",
      body: JSON.stringify({
        orgId: id,
        name,
        externalId,
        licenseKey,
        ownerEmail: owner,
      }),
    });
    onEdit();
  };

  return (
    <Modal
      submit={handleSubmit}
      open={true}
      header={"Edit Organization"}
      cta={"Update"}
      close={close}
      inline={!close}
    >
      <div className="form-group">
        Company Name
        <input
          type="text"
          className="form-control"
          value={name}
          required
          minLength={3}
          onChange={(e) => setName(e.target.value)}
        />
        {isCloud() ? (
          <div className="mt-3">
            License Key
            <input
              type="text"
              className="form-control"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
            />
          </div>
        ) : (
          <div className="mt-3">
            External Id: Id used for the organization within your company
            (optional)
            <input
              type="text"
              className="form-control"
              value={externalId}
              minLength={3}
              onChange={(e) => setExternalId(e.target.value)}
            />
          </div>
        )}
        <div className="mt-3">
          Owner Email
          <input
            type="email"
            className="form-control"
            value={owner}
            required
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditOrganization;
