import { Model, Collumn, CollumnType, SaveCallback } from './model';

export default class Account extends Model {
	
	public version = 1;
	public table = 'account';
	public collumns: Collumn[] = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: CollumnType.int,
			autoIncrement: true,
			nullable: false,
			unique: true
		}, {
			name: 'username',
			primary: true,
			taintable: true,
			type: CollumnType.string,
			autoIncrement: false,
			nullable: false
		}, {
			name: 'password',
			primary: false,
			taintable: true,
			type: CollumnType.tinytext,
			autoIncrement: false,
			nullable: false
		}, {
			name: 'salt',
			primary: false,
			taintable: false,
			type: CollumnType.string,
			autoIncrement: false,
			nullable: false
		}, {
			name: 'pepper',
			primary: false,
			taintable: false,
			type: CollumnType.string,
			autoIncrement: false,
			nullable: false
		}, {
			name: 'permissions',
			primary: false,
			taintable: false,
			type: CollumnType.json,
			autoIncrement: false,
			nullable: false
		}, {
			name: 'email',
			primary: false,
			taintable: true,
			type: CollumnType.string,
			autoIncrement: false,
			nullable: true,
			default: 'NULL'
		}, {
			name: 'mobile',
			primary: false,
			taintable: true,
			type: CollumnType.string,
			autoIncrement: false,
			nullable: true,
			default: 'NULL'
		}
	];

	public id: number = -1;
	public username: string = '';
	public password: string = '';
	public salt: string = '';
	public pepper: string = '';
	public mobile: string|null = null;
	public email: string|null = null;
	public permissions: Object = {};

	private static peppers: {[key: string]: string} = {
		'$2b$10$B/fz1WPunDV.SK03Liajtu': '$2b$10$5Lx3yjrCtqFffqXf2V0TPe',
		'$2b$10$UtRaMflPyQ68dO26MhGP9e': '$2b$10$.NioQsQCR4JxEGSEZbstkO',
		'$2b$10$u1BtIBEOz2HhLnpbQvO7JO': '$2b$10$hvzodqRSsvWtvvDSuPxOLe',
		'$2b$10$GjfuLSFrn.EpNxLxwSsyce': '$2b$10$vthaQAFYxiFcqvflNnvXAu',
		'$2b$10$IjINCnb.lHMxX4iDiPZAkO': '$2b$10$TXGP2DbVuTmNg73EhchsXu',
		'$2b$10$qFpP2UnfQMWoSsjtq98kMO': '$2b$10$VeOlihcV.TKMnEHniEXsgu',
		'$2b$10$gTUjJzWD1gvrblCw804Gbu': '$2b$10$z0/HZaB9ruAamC/aZWKGt.',
		'$2b$10$5jWTR8pgZdE5D2H5Icvzeu': '$2b$10$GJOHIkPmiFLEtIenu/D1mu',
		'$2b$10$qzxsiR86JsSONukq06tLA.': '$2b$10$aVB7KzIw7YkqrUKesFobA.',
		'$2b$10$AO15Xkjs.krcxR3MJqRqgu': '$2b$10$t8lkyqMLjOeDXyJ.CWFPmO',
		'$2b$10$22RvKJoV/7/Ly8zEa85BCO': '$2b$10$jkF5DzHTuRykWyfb3N1rpu',
		'$2b$10$3JSLJje6IeXn.wGHcuP0Uu': '$2b$10$F4X/r4cGcdpPGkr8mmsUju',
		'$2b$10$uH/Qz7vZ8rsB1h19iDAXgO': '$2b$10$kr4JYt3LSnKLhS2hxYwDMO',
		'$2b$10$Mlx3iD11zAvR/qNgk9if/u': '$2b$10$ElSeN2Z/M9ArS3MLU2Rv/O',
		'$2b$10$I4u8yVnMk3EWLWlG33eUw.': '$2b$10$3XuSpoYpKHPAAtoz5yA9iu',
		'$2b$10$RUhDcGyTvwgIUC4TfplEMu': '$2b$10$yw8eofvXPTn6cVhf3nkPfO',
		'$2b$10$JfBem.yN9bXBruHejQvF2e': '$2b$10$sCUBUvqcGiRpbeJ/aMOGc.',
		'$2b$10$GWHZXhWgnmbaHweZsltYfu': '$2b$10$EnrQT7sEjoyOV3RMtNoBv.',
		'$2b$10$2BFRYQRSUuibu9VSrw0bve': '$2b$10$Pv.6cok6Q55lTnLaYx6K5O',
		'$2b$10$DYdMq9tDwLdFN0mToMfYnO': '$2b$10$QnCa8muUy1qzJ3nEjfWgxO',
		'$2b$10$Xee/s6E4ixvf5J7yqODER.': '$2b$10$l6s1/BenAXTHUiptan56Oe',
		'$2b$10$mULTUzyhHF3tDebEugxwQu': '$2b$10$D1VvKwIBltzvVoA48nu27u',
		'$2b$10$BTErdxnrrHVZ7MMItVa2E.': '$2b$10$XtijLFs6qKkFVSaUu3vQIe',
		'$2b$10$CMTENPokOV4qKxlzzf6mTu': '$2b$10$sJqyx7npvK5nNvpcpOPIk.',
		'$2b$10$/25qs60s6Ngmm.0H1FyKT.': '$2b$10$iLju2XjbE14MLhdUgiTvcO',
		'$2b$10$98uuozjaRqgzj1tB1czVy.': '$2b$10$5eCR1G72gaDcOm6HXxXVye',
		'$2b$10$Rn20YZPpSyGKNlMDm1QBfu': '$2b$10$o8F7rOTWhC9.sNDOIR7wue',
		'$2b$10$7J.9jTzm4HAu3mj/8Nfj5u': '$2b$10$AlJqUzYxpH0FtowehB/Qku',
		'$2b$10$Z000S5izilinhd9P9nSHAu': '$2b$10$mpL/AQ.yEGKHlc2wAA.3wu',
		'$2b$10$vC/yUHU1rr4mll8aS7JqBO': '$2b$10$51Jhsio2DBljvJabMvZwBe',
		'$2b$10$9A0oLZeq9g9mPuX/QAEQyO': '$2b$10$60ZC5.E6ELN5DkZZvDrFwO',
		'$2b$10$Z2aIGRtwFF8edaOpjV/Ale': '$2b$10$ezgjMuLH67YQ5aNgT//mve',
		'$2b$10$BsNiBU8iesxdoNiZ7MvGQe': '$2b$10$zJFvIXstjzegYnymBBKS2e',
		'$2b$10$vgNS5rpz3CSIi479ACvCoe': '$2b$10$Vuou8DgWbhkmaU3O4kRZrO',
		'$2b$10$bAlyq9ZhwSOPRiFnIm6Lc.': '$2b$10$GL8yPo2aMjRa3bfm/iBK5O',
		'$2b$10$NYuqf03h6SrVA5RQifqkxu': '$2b$10$6F3qF4o3Vdl17YMoXc2lMe',
		'$2b$10$OnKQt0Z/2PtklmWWrR5c3.': '$2b$10$aP9QZuQki2YCQGkOAp6LNu',
		'$2b$10$70sWfgM1eRgzfzWUYQ.5Cu': '$2b$10$ovXE.ULaN74sS8T5xT4QYO',
		'$2b$10$eJxFv/nQzu.FXT3YAzZn4e': '$2b$10$ZPURHfPvgQ8SJdt2xY9Gee',
		'$2b$10$bUgzhBwfhLx98GvtLAC2mu': '$2b$10$OK1kJXVPHGQ3qqRGXjEN7u',
		'$2b$10$qmoohWztW4HY0kKK39Dere': '$2b$10$KEASYwdcSRGCTAr.a.smKu',
		'$2b$10$V1jgswtaX1kcmtCVSK7Jiu': '$2b$10$u9vblDLMXTXlxe3.ta.LGu',
		'$2b$10$GseGbMUzts9n44t/OI6VuO': '$2b$10$XxzoC6Ejdz7GrDWy4UEElu',
		'$2b$10$AyFkZUMyTBy1rU9iYNjSYe': '$2b$10$fuPstkQCFXx45knWQGoq/u',
		'$2b$10$yLe8J3ZMjYROV60g49PNYe': '$2b$10$bHBuA1kIsQvVV6FqklHUGu',
		'$2b$10$73D0hIN30UBlfe3Yw8zLk.': '$2b$10$gGj7u.H0v2V7976cxeutKO',
		'$2b$10$yTQ2DGHvou8u2cQXbIiv7e': '$2b$10$sr4hc7H0WZonbDqpmtAqpe',
		'$2b$10$d8Ep5sb.ZS9y3Dm6rmZBUe': '$2b$10$dLiwQtpWsWKpXkV0fkLW.e',
		'$2b$10$75bGgYJrHpBMuh69YDtG5e': '$2b$10$sXcdf6GoPcuUd1T0wi2pIu',
		'$2b$10$YnIUee1uzilPktopudH8oe': '$2b$10$QpWs1IOdJomNJdA.MFyg/u',
		'$2b$10$eRnCM4KTHmumXVlpu05c0.': '$2b$10$4Xla7r7jtJ3JIMseVXlY5u',
		'$2b$10$u7QGLgYjQ6UdzPmEtabcEO': '$2b$10$lhYNcGZYHf6o08jxlxdPUe',
		'$2b$10$AS1ML5XMZs3k9X5p3dA/5O': '$2b$10$BjEh8Z0rR.arwhv.X/98YO',
		'$2b$10$pKJOISOVjBaLEavrtNGUR.': '$2b$10$6BPUJl7M/UqdWfmD9iV7LO',
		'$2b$10$XuAkcEhAi4EMeMKNWMnSVu': '$2b$10$f3eHU0OBTFxfxCipEAjRPO',
		'$2b$10$MJLn2ZptRT60klfAv2/FTO': '$2b$10$asf8vuWHGhpMzpW9Kjj/Ce',
		'$2b$10$qGPas93hnU8D2bDWIqACdO': '$2b$10$hE71/I1f96OSYVgB9gZG9u',
		'$2b$10$b5eMzW6W1Y5HpUbRxBqFiO': '$2b$10$kgZA78cImL9qyMRo3wHat.',
		'$2b$10$lXnM4sgqYnMarVtz9Q5xN.': '$2b$10$Kh6IH0WIQ1y1g9./Hy1zC.',
		'$2b$10$T8wb5pDKxFc/De74GLKN2O': '$2b$10$ib1Gd53mtzLLQArFQuVisO',
		'$2b$10$o.Pt4vt4WE.6OGxAkvZmVO': '$2b$10$2m4zZZeLG8x8mBD0JA83u.',
		'$2b$10$Ex2nN2dLWWJLrtl5/e6OIO': '$2b$10$hKeDKqrK/GRVKstmWKgL4u',
		'$2b$10$wlwZDjDWb7Gb2Qc0.cQfmO': '$2b$10$8bYm1OUu5WvHV.x00flhw.',
		'$2b$10$t292q4aK/3zbbGzA8BvzB.': '$2b$10$MzBHrFcnfqEmZhVsr0Zape',
		'$2b$10$1VlFcUC.DMDscNSBfdv8Ju': '$2b$10$uXMg.Vm4bMmvPyfimWOQTe',
		'$2b$10$e7ni0GWZh.GNfEXTFE5phe': '$2b$10$NFWhk3dBJe1C64I6q6UOZO',
		'$2b$10$um27dqL5GYA.O58U.k7GZ.': '$2b$10$IfDwsVvX3fhWjt0SwhyDHu',
		'$2b$10$10lh0NMJGPBD/27RCKWjMO': '$2b$10$Q21XjDMcD8t2qeLKYKd2W.',
		'$2b$10$b8zmchnNcsb73BXrntkx/O': '$2b$10$HDNJRzTTykzPHncsZRWoc.',
		'$2b$10$UYOArlKrdZEx2Ye1Wd8EYu': '$2b$10$oCILZxiIKF8x94XfvkQFOO',
		'$2b$10$HJi.otLayOCYwT1KVp3QTO': '$2b$10$6rWsvcb4KRdEF3qb10Pole',
		'$2b$10$TVzNRy/4FPeizbW0XNhdye': '$2b$10$9pKxlodQd5H6m5mIEmGEc.',
		'$2b$10$uFDKp7oaNCCOIM9RuigFsO': '$2b$10$PBanXOnXOo/UbMV.0/o6Ou',
		'$2b$10$05BuCoNiZcK4IzS060HxYO': '$2b$10$K9K8EVyH7AmR86a/hdwJyO',
		'$2b$10$Gk1b0V57vZuYSg9OydOKSe': '$2b$10$5rL3HdJTjFFCNndUg8pvZu',
		'$2b$10$6sPWP/qbDRMRaq5KAPdCbO': '$2b$10$NUvFUc2TCoUtDnE.HmH70e',
		'$2b$10$lFEQS1VJaK3Vf7y2tNwlgO': '$2b$10$2pejmy4AEVSyr.esO1xoj.',
		'$2b$10$IAz5lFusbvr2cRa.lfzLDe': '$2b$10$F9ECYtRiQev80l3kZB3uOO',
		'$2b$10$uFi1ezZSslRlfL185Qx97.': '$2b$10$Zh1OmVuM3DKI4rYQITb4R.',
		'$2b$10$uaS2RFHDxFDHhgRrqEWppu': '$2b$10$EBVSqEpxX4NKqYzLJLDO8e',
		'$2b$10$P59SqOoNXCvPg6wZRQ7lp.': '$2b$10$oKbkwzGVg/eJwfr5wbykVe',
		'$2b$10$8AuNVfMmTAUsZ3uIXbmlh.': '$2b$10$Sn7ZLhU2KtSEWtX1LuamRe',
		'$2b$10$7.QBL8mjijNXRs8C0LIPHe': '$2b$10$Cr2qUXzT5OYUB6Wl9ERBAu',
		'$2b$10$fz2BL3kXPSKwE3ce1sddz.': '$2b$10$Wd8X5.bY1kDryzFNKwHGmO',
		'$2b$10$u9n6QlWZGyKUhZwAuxLv0e': '$2b$10$PHFkvGmouSVrV2AlXklb6.',
		'$2b$10$AYhq18BH6ubQpeu0VK6g4u': '$2b$10$Qn2Yvms6wmNNe7xaZHAm6.',
		'$2b$10$SAh01Oj63RbU5qo7O5EV.e': '$2b$10$fY4kJYH9HTpzP3edO4cUne',
		'$2b$10$gfVndGBiZGXVA7Zsp0eFd.': '$2b$10$yYcpQi7lHE32vaPbZw7Oxe',
		'$2b$10$rZYh1p4ObizAGiriKtAtv.': '$2b$10$1NW594MnopU1cQA.KMrk4u',
		'$2b$10$sCOP6l19EYCoZDDgBgwIhu': '$2b$10$1deTljr1OwjVxCHONXCzNO',
		'$2b$10$3EyoVUCBx0yTNyfU/oyzpe': '$2b$10$5vna5Gt9rv4bqKcg1C0LkO',
		'$2b$10$AUAzcao4HGXgiFQlWEc2ye': '$2b$10$DEZEumJvVeXu34ElYsvm..',
		'$2b$10$rbLWBTyUDlyljslNpKmbZe': '$2b$10$sdhf76qlFmWfG9osQ5N1Wu',
		'$2b$10$1tptpEFzHNlhbe6rCh8k6.': '$2b$10$eRUO2Vumew/ponRl/Uykse',
		'$2b$10$QQmOv5i9EJLAKTygCPuKhe': '$2b$10$fdXSoCvZqF6/dvVMd/y6hu',
		'$2b$10$MgPBH/z898PdEeVXzaEb1.': '$2b$10$05D8isNgCsFpMsWgVjuNVO',
		'$2b$10$9kDlYGLfgpM5M1XeOZjntO': '$2b$10$RC77I6qIAzUVutlHgOIaZ.',
		'$2b$10$IVizYIXuHi7nnyR1LuQAz.': '$2b$10$UKNPBIxOA1wED3KRPN9Yqe',
		'$2b$10$w6LgKneLrvvfnQfld8OCF.': '$2b$10$Zq0l8gh6ugES8e2PzKskse',
		'$2b$10$zreUfwgHtRqDgU/zqPmD3O': '$2b$10$j9BA3K3MSk8TZBUUtrCe1e'
	}

	public static Peppers = () => {
		return Account.peppers;
	}

	constructor() {
		super();
	}

	public createDefaultEntries = (callback: () => void) => {
		// account that acts as system user
		const houseAccount = new Account();
		houseAccount.id=0;
		houseAccount.username='houseaccount';
		houseAccount.password=''; // empty string is a impossable input, cant be logged into
		houseAccount.salt='';
		houseAccount.pepper='';
		houseAccount.mobile='';
		houseAccount.email='';
		houseAccount.permissions={};


		const saveCallback: SaveCallback = (success: boolean) => {
			callback();
		};

		houseAccount.save(saveCallback, [
			'id',
			'username',
			'password',
			'salt',
			'pepper',
			'mobile',
			'email',
			'permissions'
		]);
	};
};