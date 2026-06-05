import { getDocFlowAPI } from './api-client';
import { axiosInstance } from './axios-instance';

export interface DocumentVersionUpdateGeneralInfoDTO {
	name: string;
}

const docFlowApi = getDocFlowAPI();

export const api = {
	...docFlowApi,
	changeDocumentVersionGeneralInfo: (
		documentId: number,
		versionId: number,
		dto: DocumentVersionUpdateGeneralInfoDTO,
	) =>
		axiosInstance<void>({
			url: `/api/Documents/${documentId}/versions/${versionId}/change-general-info`,
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			data: dto,
		}),
};

export type * from './api-client';
