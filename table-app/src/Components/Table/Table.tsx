import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled, { CSSProperties } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort } from '@fortawesome/free-solid-svg-icons'
import {InputProps, TableData, SortType, SortOption, TableProps, TableColumns, BoundingBoxes, RowRefs } from '../../models/models';


const StyledTable = styled.table`
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    font-size: 1rem;
    color: #444;
    white-space: nowrap;
`

const StyledTh = styled.th<InputProps>`
    border: 1px solid #bababa;
    background-color: lightblue;
    min-width: ${props => props.inputWidth}px;
    width: ${props => props.inputWidth}px;
    cursor: pointer;
    text-align: left;
    padding: .5rem 1rem;
    text-transform: uppercase;
    overflow: hidden;

    &:hover {
        background-color: #9ed1e1;
    }
`;

const StyledTd = styled.td<InputProps>`
    border: 1px solid #cacaca;
    padding: .5rem 1rem;
    text-align: left;
    width: ${props => props.inputWidth}px;
    max-width: ${props => props.inputWidth}px;
    overflow: hidden;
`;

const StyledTr = styled.tr`
    &:nth-child(even) {
        background-color: #f2f2f2;

        &:hover {
            background-color: #e0e0e0;
        }
    }

    &:nth-child(odd) {
        background-color: white;

        &:hover {
            background-color: #e0e0e0;
        }
    }

`;

const StyledWrapper = styled.div`
    max-width: 100%;
    position: relative;
    overflow: auto;
`;

const StyledSpan = styled.span`
    padding-right: .5rem;
`;

const Table: React.FC<TableProps> = (props) => {

    const trRefs = useRef<RowRefs>({});
    
    const transformData = () => {
        return props.data.map( (row, index) => {
            return {...row, id: index}
        })
    };

    const [rowBoundingBox, setRowBoundingBox] = useState<BoundingBoxes>({});
    const [data, setData] = useState<TableData[]>(transformData());
    const [sortColumnName, setSortColumnName] = useState<SortOption>({});
    const [lastColumnVisible, setLastColumnVisible] = useState<boolean | null>(null);

    const sortData = (columnName: string, sortType: SortType) => {
        const copiedData = [...data];

        copiedData.sort( (a,b) => {
            if ( a[columnName] > b[columnName] ) {
                return sortType === 'asc' ? 1 : -1
            } else if (a[columnName] < b[columnName] ) {
                return sortType === 'asc' ? -1 : 1
            } else {
                return 0
            }
        });

        setData(copiedData);
    }

    const onSortHandler = ( columnName: string ) => {
        let sortOpt: 'asc' | 'desc' = 'asc';

        if ( columnName in sortColumnName && sortColumnName[columnName] === 'asc' ) {
            sortOpt = 'desc';
        }

        sortData(columnName, sortOpt);
        setSortColumnName({[columnName]: sortOpt});
    }

    const renderHeader = (columnName: string ) => {
        let opt: string;
        if ( columnName in sortColumnName ) {
            opt = sortColumnName[columnName];
        } else {
            return (<div><StyledSpan>{columnName}</StyledSpan><FontAwesomeIcon icon={faSort} /></div>)
        }

        return opt === 'asc' ? (<div><StyledSpan>{columnName}</StyledSpan><FontAwesomeIcon icon={faSortUp} /></div>) : (<div><StyledSpan>{columnName}</StyledSpan><FontAwesomeIcon icon={faSortDown} /></div>)
        
    }

    const tableWidth = props.columns.reduce( (prevValue, currCol ) => {
        return prevValue + currCol.width;
    },0)

    const resizeHandler = useCallback(() => {
        if (window.innerWidth > tableWidth && ( lastColumnVisible === true || lastColumnVisible === null)) {
            setLastColumnVisible(false);
        } else if ( window.innerWidth < tableWidth && ( lastColumnVisible === false || lastColumnVisible === null)) {
            setLastColumnVisible(true);
        }
    },[lastColumnVisible,tableWidth]);

    useEffect( () => {
        if (lastColumnVisible === null) {
            resizeHandler();
        } 

        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
        }
    },[lastColumnVisible, resizeHandler]);

    useEffect( () => {
        const boundingBoxes: BoundingBoxes = {};

        for (let id in trRefs.current) {
            const domNode = ReactDOM.findDOMNode(trRefs.current[id]) as HTMLTableRowElement;

            if (domNode) {
                const newBox = domNode.getBoundingClientRect();
                boundingBoxes[id] = newBox;

                const oldBox = rowBoundingBox[id];

                if (oldBox) {
                    const deltaX = oldBox.left - newBox.left; 
                    const deltaY = oldBox.top  - newBox.top;

                    requestAnimationFrame( () => {
                        domNode.style.transform  = `translate(${deltaX}px, ${deltaY}px)`;
                        domNode.style.transition = 'transform 0s';  
                        
                        requestAnimationFrame( () => {
                        domNode.style.transform  = '';
                        domNode.style.transition = 'transform 500ms';
                        });
                    });
                }
            }
        }

        setRowBoundingBox(boundingBoxes);
  
    },[data]);


    const renderTable = ( tableColumns: TableColumns[], tableData: TableData[], absStyle: boolean) => {

        let tableStyle: CSSProperties = {};
        if ( absStyle === true) {
            tableStyle = {position: 'absolute', top: 0, right: 0};
        } 

        return (
            <StyledTable style={tableStyle}  >
                <thead >
                <tr>
                {tableColumns.map( (column) => {
                    return <StyledTh 
                                key={column.name} 
                                onClick={onSortHandler.bind(null,column.name)} 
                                inputWidth={column.width}>
                                    {renderHeader(column.name)}
                            </StyledTh>
                })}
                </tr>
            </thead>
            <tbody>
                {tableData.map( row => {
                    return (
                        <StyledTr key={row.id} ref={ (el:HTMLTableRowElement) => trRefs.current[+row.id] = el}>
                            {tableColumns.map( (column) => {
                                    return <StyledTd inputWidth={column.width} key={column.name}>{row[column.name] ? row[column.name] : ''}</StyledTd>
                            })}
                        </StyledTr>
                    )
                })}
            </tbody>
        </StyledTable>
        )
    }
 
        return (
                <div>
                <StyledWrapper>
                    {renderTable( props.columns, data, false )}
                </StyledWrapper>
                { lastColumnVisible ? renderTable( props.columns.slice(-1), data, true) : null}
            </div>
        )

    
}

export default Table;