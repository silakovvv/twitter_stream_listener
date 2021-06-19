import React, { Component } from 'react';

export class Pagination extends Component {

    render() {
        const { totalCount, perPage, paginate, currentPage, nextPage, prevPage } = this.props;

        const totalPage = Math.ceil(totalCount / perPage);

        const pageNumbers = [];

        for (let i = 1; i <= totalPage; i++) {
            pageNumbers.push(i);
        }

        const handlePrevClick = (evt) => {
            evt.preventDefault();
            console.log({ "currentPage": currentPage - 1, "totalPage": totalPage, "if": currentPage - 1 == 0 });
            if (currentPage - 1 > 0) {
                paginate(currentPage - 1);
            }
        }

        const handleNextClick = (evt) => {
            evt.preventDefault();
            if (currentPage + 1 <= totalPage) {
                paginate(currentPage + 1);
            }
        }

        return (
            <nav>
                <ul className="pagination justify-content-center">
                    <li className="page-item">
                        <a  className="page-link"
                            onClick={handlePrevClick}
                            href="/">
                            &lt;&lt;
                        </a>
                    </li>
                    {pageNumbers.map(num => (
                        <li className="page-item" key={num}>
                            <a  onClick={(evt) => { evt.preventDefault(); paginate(num); }}
                                href="/"
                                className="page-link disabled">
                                {num}
                            </a>
                        </li>
                    ))}
                    <li className="page-item">
                        <a  className="page-link"
                            onClick={handleNextClick}
                            href="/">
                            &gt;&gt;
                        </a>
                    </li>
                </ul>
            </nav>
        )
    }
}