import "./page-status.scss";

type PageStatusProps = {
	loading?: boolean;
	error?: string;
	loadingText?: string;
};

export function PageStatus({
	loading,
	error,
	loadingText = "Загрузка...",
}: PageStatusProps) {
	if (loading) {
		return <p className="page-status page-status_loading">{loadingText}</p>;
	}

	if (error) {
		return <p className="page-status page-status_error">{error}</p>;
	}

	return null;
}
