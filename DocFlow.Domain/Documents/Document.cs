using DocFlow.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.Domain.Documents
{
	public class Document : BaseEntity, IAgregateRoot
	{
		private readonly List<DocumentVersion> _versions = new();

		public int AuthorId { get; private set; }
		public int CategoryId { get; private set; }
		public bool IsPrivate { get; private set; }
		public DocumentDraft Draft { get; private set; } = new("");
		public bool IsChanged { get; private set; } = false;
		public IReadOnlyList<DocumentVersion> Versions => _versions;

		public Document(int authorId, int categoryId, bool isPrivate)
		{
			SetAuthor(authorId);
			SetCategory(categoryId);
			SetPrivate(isPrivate);
		}
		public void SetAuthor(int authorId)
		{
			if (authorId <= 0)
				throw new ArgumentException("Id автора должно быть положительным");

			AuthorId = authorId;
		}
		public void SetCategory(int categoryId)
		{
			if (categoryId <= 0)
				throw new ArgumentException("Id категории должно быть положительным");

			CategoryId = categoryId;
		}
		public void SetPrivate(bool isPrivate) => IsPrivate = isPrivate;

		public void SaveDraft(string content)
		{
			if (content != Draft.Content.Value)
				IsChanged = true;
			Draft.Update(content);
		}
		public void AddVersion()
		{
			var lastDocumentVersion = GetLastVersion();

			if (!IsChanged || lastDocumentVersion != null && lastDocumentVersion.Content.Value == Draft.Content.Value)
				throw new ArgumentException("Текст этой версии не отличается от предыдущей");

			int version = lastDocumentVersion?.Version ?? 1;
			DocumentVersion documentVersion = new(version, Draft.Content.Value);
			_versions.Add(documentVersion);

			IsChanged = false;
		}
		public void ResetDraft()
		 => Draft.Update(GetLastVersion()?.Content?.Value ?? "");

		private DocumentVersion? GetLastVersion() => _versions.LastOrDefault();
	}
}
