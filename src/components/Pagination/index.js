import React from 'react'

export default function Pagination({ currentPage, onClickPage, totalCount, pageSize }) {
  const totalPageCount = Math.ceil(totalCount / pageSize)
  const range = (start, end) => {
    const length = end - start + 1

    return Array.from({ length }, (_, idx) => idx + start)
  }
  const pages = range(1, totalPageCount)

  return (
    <div className="pagination">
      <div className="numbers">
        {pages.map(page => (
          <button className={currentPage === page ? 'active' : ''} onClick={() => onClickPage(page)} key={page}>
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}
