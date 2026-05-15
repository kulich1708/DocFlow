using System;
using System.Collections.Generic;
using System.Text;

namespace DocFlow.API.Common
{
	public abstract class BaseEntity
	{
		private int _id;
		public virtual int Id
		{
			get => _id;
			protected set => _id = value;
		}
		public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
		protected BaseEntity()
		{
		}

		protected BaseEntity(int id)
		{
			_id = id;
		}
	}
}
