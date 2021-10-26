import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import {
	cancelConfirmProofThunk,
	confirmProofThunk,
	fetchUserThunk,
} from '../store/actions';
import { Table, Layout, Button } from 'antd';
import styles from '../styles/Admin.module.css';
import { nameTarget } from '../components/ActivityFeed';
import useModelOnlyShowActivity from '../hooks/useModelOnlyShowActivity';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';

const { Content } = Layout;

let option = [
    {
        key: 'false',
        label: 'Chưa xác nhận',
        style: {
            backgroundColor: 'white',
        },
    },
	{
		key: 'true',
		label: 'Đã xác nhận',
		style: {
			backgroundColor: '#95de64',
		},
	},
	{
		key: 'Minh chứng không hợp lệ',
		label: 'Minh chứng không hợp lệ',
		style: {
			backgroundColor: '#ff7875',
		},
	},
];

export default function AdminManageUser() {
	const dispatch = useDispatch();
	let listUser = useSelector((state) => state.userActivity.value);
	let { ui, setVisible, setDataModel } = useModelOnlyShowActivity({
		title: 'Chi tiết hoạt động.',
	});

	useEffect(async () => {
		dispatch(fetchUserThunk()).catch((error) => console.log(error.message));
	}, []);

	const handleConfirm = (uid, acId, confirm) => {
		let isConfirm = confirm === 'true';
		console.log('handle confirm: ', { uid, acId, confirm });
		if (isConfirm) dispatch(confirmProofThunk({ uid, acId }));
		else dispatch(cancelConfirmProofThunk({ uid, acId, confirm }));
	};

	const handleClickNameActivity = (item, uid) => {
		setDataModel({ ...item, uid });
		setVisible(true);
	};

	const expandedRowRender = (activity) => {
		const columns = [
			// {
			// 	title: 'Trạng thái',
			// 	dataIndex: 'active',
			// 	key: 'active',
			// 	// filters: [
			// 	// 	{
			// 	// 		text: 'Chưa kích hoạt',
			// 	// 		value: 'false',
			// 	// 	},
			// 	// 	{
			// 	// 		text: 'Đã kích hoạt',
			// 	// 		value: 'true',
			// 	// 	},
			// 	// ],
			// 	// defaultFilteredValue: ['true'],
			// 	// onFilter: (value, record) => record.active.toString() === value,
			// 	render: (text) => <Switch checked={text} size="small" />,
			// },
			{
				title: 'Tên hoạt động',
				key: 'name',
				render: (item) => {
					return (
						<Button
							type="link"
							onClick={() =>
								handleClickNameActivity(item, activity.userId)
							}
						>
							{item.name}
						</Button>
					);
				},
			},
			{
				title: 'Tiêu chí',
				key: 'target',
				render: (item) => nameTarget[item.target],
			},
			{ title: 'Ngày diễn ra', dataIndex: 'date', key: 'date' },
			{
				title: 'Trạng thái',
				key: 'confirm',
				filters: [
					{
						text: 'Đã xác nhận',
						value: 'true',
					},
					{
						text: 'Chưa xác nhận',
						value: 'false',
					},
				],
				onFilter: (value, record) =>
					record.confirm.toString() === value,
				defaultFilteredValue: ['false'],
				render: (item) => {
					return (
						<InputSelectWithAddItem
							defaultValue={item.confirm.toString()}
							value={option}
							setValue={(key) =>
								handleConfirm(activity.userId, item.id, key)
							}
							style={{
								width: '100%',
								maxWidth: 250,
							}}
						/>
					);
				},
			},
		];

		return (
			<Table
				columns={columns}
				dataSource={
					activity.listData.map((c, key) => ({ ...c, key })) || []
				}
				size="small"
				pagination={false}
			/>
		);
	};

	const columns = [
		{
			title: 'Tên',
			key: 'name',
			filters: [
				{
					text: 'Có đăng ký hoạt động',
					value: true,
				},
				{
					text: 'Không đăng ký hoạt động',
					value: false,
				},
			],
			onFilter: (value, record) =>
				value
					? record.listData.length !== 0
					: record.listData.length === 0,
			defaultFilteredValue: [true],
			render: (item) => (
				<p>
					{item.fullName ||
						item.email.slice(10, item.email.indexOf('@'))}
				</p>
			),
		},
		{
			title: 'Mssv',
			key: 'mssv',
			render: (item) => <p>{item.email.slice(0, 10)}</p>,
		},
		{
			title: 'Lớp',
			key: 'classUser',
			render: (item) => <p>{item.classUser || 'Sv chưa điền'}</p>,
		},
	];

	const loadTable = (listUser = []) => (
		<Table
			columns={columns}
			expandable={{
				rowExpandable: (record) => record.listData.length !== 0,
				expandedRowRender,
			}}
			dataSource={listUser}
			size="small"
		/>
	);
	return (
		<Content className={styles.contentAdminManageUser}>
			{listUser?.length ? (
				loadTable(listUser.map((c, key) => ({ ...c, key })))
			) : (
				<Loading />
			)}
			{ui()}
		</Content>
	);
}
