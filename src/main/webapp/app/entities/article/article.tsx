import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { openFile, byteSize, Translate, TextFormat, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './article.reducer';
import Sidebar from 'app/shared/layout/sidebar/Sidebar';

import './article.css'; // Import the CSS file

export const Article = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const articleList = useAppSelector(state => state.article.entities);
  const loading = useAppSelector(state => state.article.loading);
  const totalItems = useAppSelector(state => state.article.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      })
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  return (
    <div>
      <Sidebar />
      <div className="table-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-3 p-3 custom-bg-color text-white rounded">
          <h2 id="article-heading" data-cy="ArticleHeading" className="mb-0">
            <Translate contentKey="faeApp.article.home.title">Articles</Translate>
          </h2>
          <div  className="d-flex justify-content-end ajust2" style={{ gap: '10px', marginLeft: '350px' }}>
            <Button className="bt btn-info me-2" onClick={handleSyncList} disabled={loading} style={{ width: '220px', height: '40px' }}>
              <FontAwesomeIcon icon="sync" spin={loading} />{' '}
              <Translate contentKey="faeApp.article.home.refreshListLabel">Refresh List</Translate>
            </Button>
            <Link to="/article/new" className="btn btn-primary btn-success jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton" style={{ width: '220px', height: '40px' }}>
              <FontAwesomeIcon icon="plus" />
              &nbsp;
              <Translate contentKey="faeApp.article.home.createLabel">Create new Article</Translate>
            </Link>
          </div>
        </div>
        <div className="table-responsive">
          {articleList && articleList.length > 0 ? (
            <Table className="table-striped">
              <thead className="thead-dark">
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="faeApp.article.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('modele')}>
                  <Translate contentKey="faeApp.article.modele">Modele</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('largeurPneus')}>
                  <Translate contentKey="faeApp.article.largeurPneus">Largeur Pneus</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('hauteurPneus')}>
                  <Translate contentKey="faeApp.article.hauteurPneus">Hauteur Pneus</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('typePneus')}>
                  <Translate contentKey="faeApp.article.typePneus">Type Pneus</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('diametre')}>
                  <Translate contentKey="faeApp.article.diametre">Diametre</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('photo')}>
                  <Translate contentKey="faeApp.article.photo">Photo</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateCreation')}>
                  <Translate contentKey="faeApp.article.dateCreation">Date Creation</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
              </thead>
              <tbody>
              {articleList.map((article, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/article/${article.id}`} color="link" size="sm">
                      {article.id}
                    </Button>
                  </td>
                  <td>{article.modele}</td>
                  <td>{article.largeurPneus}</td>
                  <td>{article.hauteurPneus}</td>
                  <td>{article.typePneus}</td>
                  <td>{article.diametre}</td>
                  <td>
                    {article.photo ? (
                      <div>
                        {article.photoContentType ? (
                          <a onClick={openFile(article.photoContentType, article.photo)}>
                            <img src={`data:${article.photoContentType};base64,${article.photo}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                            {article.photoContentType}, {byteSize(article.photo)}
                          </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {article.dateCreation ? <TextFormat type="date" value={article.dateCreation} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/article/${article.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}

                      </Button>
                      <Button
                        tag={Link}
                        to={`/article/${article.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}

                      </Button>
                      <Button
                        tag={Link}
                        to={`/article/${article.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}

                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </Table>
          ) : (
            !loading && (
              <div className="alert alert-warning">
                <Translate contentKey="faeApp.article.home.notFound">No Articles found</Translate>
              </div>
            )
          )}
        </div>
        {totalItems ? (
          <div className={articleList && articleList.length > 0 ? '' : 'd-none'}>
            <div className="d-flex justify-content-center">
              <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
            </div>
            <div className="d-flex justify-content-center">
              <JhiPagination
                activePage={paginationState.activePage}
                onSelect={handlePagination}
                maxButtons={5}
                itemsPerPage={paginationState.itemsPerPage}
                totalItems={totalItems}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Article;
