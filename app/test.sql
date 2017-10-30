/*
SQLyog Ultimate v12.3.1 (64 bit)
MySQL - 5.5.50 : Database - sfai-test-platform
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `sfai-test-platform`;

/*Table structure for table `sys_area_info` */

DROP TABLE IF EXISTS `sys_area_info`;

CREATE TABLE `sys_area_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `sys_area_uid` varchar(40) DEFAULT NULL COMMENT '唯一键，关联键',
  `sys_area_name` varchar(60) DEFAULT NULL COMMENT '地区名字',
  `sys_area_level` int(4) DEFAULT NULL COMMENT '级别-0:国家，根1：省2：市3：县(区)4：镇',
  `sys_parent_uid` varchar(40) DEFAULT NULL COMMENT '父节点uid',
  `createtime` varchar(40) DEFAULT NULL COMMENT '创建时间',
  `updatetime` varchar(40) DEFAULT NULL COMMENT '更新时间',
  `updateuid` varchar(40) DEFAULT NULL COMMENT '更新用户uid',
  `del_status` bit(1) DEFAULT b'0' COMMENT '删除状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

/*Data for the table `sys_area_info` */

insert  into `sys_area_info`(`id`,`sys_area_uid`,`sys_area_name`,`sys_area_level`,`sys_parent_uid`,`createtime`,`updatetime`,`updateuid`,`del_status`) values 
(2,'14885078885306566','中国',0,'','2017-03-03 10:24:48','2017-03-03 10:24:48','','\0'),
(3,'14885221738734530','湖北省',1,'14885078885306566','2017-03-03 14:22:53','2017-03-03 14:53:08','','\0'),
(4,'14885239004348861','孝感市',2,'14885221738734530','2017-03-03 14:51:40','2017-03-03 14:53:14','','\0'),
(5,'14885360838006300','汉川',3,'14885239004348861','2017-03-03 18:14:43','2017-03-03 18:14:51','','\0'),
(6,'14885360838006378','马口',4,'14885360838006300',NULL,NULL,NULL,'\0'),
(7,'14885360838006574','庙头',4,'14885360838006300',NULL,NULL,NULL,'\0'),
(8,'14885239004348632','应城',3,'14885239004348861',NULL,NULL,NULL,'\0'),
(9,'14885239004340121','武汉市',2,'14885221738734530',NULL,NULL,NULL,'\0'),
(10,'14885221738734568','广东省',1,'14885078885306566',NULL,NULL,NULL,'\0'),
(11,'14885078885306111','美国',0,' ',NULL,NULL,NULL,'\0'),
(12,'14888806079269864','湖南',1,'14885078885306566','2017-03-07 17:56:47','2017-03-09 16:06:07','123','\0'),
(13,'14888853983341247','俄罗斯',0,'','2017-03-07 19:16:38','2017-03-09 16:04:39','123','\0'),
(26,'14889541212772056','长沙',2,'14888806079269864','2017-03-08 14:22:01','2017-03-08 14:22:01','01139932','\0'),
(34,'14890462868222018','华盛顿州',1,'14885078885306111','2017-03-09 15:58:06','2017-03-09 16:05:11','123','\0'),
(35,'14890463046265956','华盛顿',2,'14890462868222018','2017-03-09 15:58:24','2017-03-09 16:05:18','123','\0'),
(36,'14890463127691854','莫斯科',1,'14888853983341247','2017-03-09 15:58:32','2017-03-09 16:04:49','123','\0'),
(37,'14890467447664706','武昌',3,'14885239004340121','2017-03-09 16:05:44','2017-03-09 16:05:44','123','\0'),
(38,'14890467948077872','娄底',2,'14888806079269864','2017-03-09 16:06:34','2017-03-09 16:06:34','123','\0');

/*Table structure for table `sys_oprt_table` */

DROP TABLE IF EXISTS `sys_oprt_table`;

CREATE TABLE `sys_oprt_table` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `sys_table_uid` varchar(40) DEFAULT NULL COMMENT '操作表uid',
  `sys_table_ename` varchar(80) DEFAULT NULL COMMENT '英文表名',
  `sys_table_cname` varchar(40) DEFAULT NULL COMMENT '中文表名',
  `createtime` varchar(40) DEFAULT NULL COMMENT '创建时间',
  `updatetime` varchar(40) DEFAULT NULL COMMENT '更新时间',
  `updateuid` varchar(40) DEFAULT NULL COMMENT '更新用户uid',
  `del_status` bit(1) DEFAULT b'0' COMMENT '删除状态',
  PRIMARY KEY (`id`),
  KEY `sys_table_uid` (`sys_table_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `sys_oprt_table` */

insert  into `sys_oprt_table`(`id`,`sys_table_uid`,`sys_table_ename`,`sys_table_cname`,`createtime`,`updatetime`,`updateuid`,`del_status`) values 
(1,'14883499177574407','user','用户','2017-03-01 14:31:57','2017-03-08 18:13:33','01139932','\0'),
(2,'14883499622707927','role','角色','2017-03-01 14:32:42','2017-03-08 09:46:03','','\0'),
(3,'14883739279149299','resource','资源','2017-03-01 21:12:07','2017-03-08 09:47:27','','\0'),
(4,'14885356433601360','area','地区','2017-03-03 18:07:23','2017-03-08 09:48:43','','\0'),
(5,'14886998435474302','table','系统表格','2017-03-05 15:44:03','2017-03-08 09:49:14',NULL,'\0');

/*Table structure for table `sys_resource_info` */

DROP TABLE IF EXISTS `sys_resource_info`;

CREATE TABLE `sys_resource_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `sys_resource_uid` varchar(40) DEFAULT NULL COMMENT '唯一键，关联键',
  `sys_resource_name` varchar(40) DEFAULT NULL COMMENT '资源节点名字',
  `sys_resource_level` int(4) DEFAULT NULL COMMENT '资源级别',
  `sys_resource_path` varchar(128) DEFAULT NULL COMMENT '资源操作url',
  `sys_parent_uid` varchar(40) DEFAULT NULL COMMENT '父节点uid',
  `createtime` varchar(40) DEFAULT NULL COMMENT '创建时间',
  `updatetime` varchar(40) DEFAULT NULL COMMENT '更新时间',
  `updateuid` varchar(40) DEFAULT NULL COMMENT '更新用户uid',
  `del_status` bit(1) DEFAULT b'0' COMMENT '删除状态',
  `icon` varchar(40) DEFAULT 'fa fa-bar-chart-o' COMMENT '资源菜单图标',
  PRIMARY KEY (`id`),
  KEY `sys_resource_uid` (`sys_resource_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

/*Data for the table `sys_resource_info` */

insert  into `sys_resource_info`(`id`,`sys_resource_uid`,`sys_resource_name`,`sys_resource_level`,`sys_resource_path`,`sys_parent_uid`,`createtime`,`updatetime`,`updateuid`,`del_status`,`icon`) values 
(1,'14862759478049741','设备类型管理',2,'/pages/demo','14862759478049744','1','2017-03-05 16:05:25','3','\0','fa fa-bar-chart-o'),
(2,'14862759478049742','设备区域管理',2,'/pages/demo2','14862759478049744','1','2017-03-05 16:05:39','3','\0','fa fa-bar-chart-o'),
(3,'14862759478049743','设备可行性分析',2,'/pages/demo3','14862759478049744','1','2017-03-05 16:06:06','3','\0','fa fa-bar-chart-o'),
(4,'14862759478049744','设备管理',1,'','','1','2017-03-05 16:05:13','3','\0','fa fa-bar-chart-o'),
(5,'14862759478049745','人员管理',2,'/pages/user','14862759478049747','1','2017-03-05 16:06:35','3','\0','fa fa-bar-chart-o'),
(6,'14862759478049746','角色管理',2,'/pages/role','14862759478049747','1','2017-03-05 16:06:52','3','\0','fa fa-bar-chart-o'),
(7,'14862759478049747','系统管理',1,'',' ','1','2017-03-05 16:06:20','3','\0','fa fa-bar-chart-o'),
(18,'14887012437361812','资源管理',2,'/pages/resource','14862759478049747','2017-03-05 16:07:23','2017-03-05 16:07:23',NULL,'\0','fa fa-bar-chart-o'),
(19,'14887012777071188','表格管理',2,'/pages/operateTable','14862759478049747','2017-03-05 16:07:57','2017-03-06 14:19:33',NULL,'\0','fa fa-bar-chart-o'),
(24,'14888881262858705','其他管理',1,'','','2017-03-07 20:02:06','2017-03-07 20:02:06',NULL,'\0','fa fa-bar-chart-o'),
(25,'14888881635729582','地域管理',2,'/pages/area','14888881262858705','2017-03-07 20:02:43','2017-03-07 20:02:43',NULL,'\0','fa fa-bar-chart-o');

/*Table structure for table `sys_role_info` */

DROP TABLE IF EXISTS `sys_role_info`;

CREATE TABLE `sys_role_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `sys_role_uid` varchar(40) DEFAULT NULL COMMENT '唯一键，关联键',
  `sys_role_name` varchar(40) DEFAULT NULL COMMENT '角色名字',
  `sys_role_desc` varchar(128) DEFAULT NULL COMMENT '角色描述',
  `createtime` varchar(40) DEFAULT NULL COMMENT '创建时间',
  `updatetime` varchar(40) DEFAULT NULL COMMENT '更新时间',
  `updateuid` varchar(40) DEFAULT NULL COMMENT '更新用户uid',
  `del_status` bit(1) DEFAULT b'0' COMMENT '删除状态',
  PRIMARY KEY (`id`),
  KEY `sys_role_uid` (`sys_role_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `sys_role_info` */

insert  into `sys_role_info`(`id`,`sys_role_uid`,`sys_role_name`,`sys_role_desc`,`createtime`,`updatetime`,`updateuid`,`del_status`) values 
(2,'14882759478049742','系统管理员','管理权限','2','2017-03-07 19:28:54','2','\0'),
(3,'14882759478049743','数据库管理员','管理数据库操作','2','2017-03-01 14:12:35','2','\0'),
(4,'14882759478049744','默认角色','默认第一次登入的','4','4','4','\0'),
(5,'14885358825112466','让他热帖','儿童','2017-03-03 18:11:22','2017-03-03 18:11:22',NULL,''),
(6,'14888043547791178','如果特','如图儿童热','2017-03-06 20:45:54','2017-03-06 20:46:06',NULL,'');

/*Table structure for table `sys_role_oprt` */

DROP TABLE IF EXISTS `sys_role_oprt`;

CREATE TABLE `sys_role_oprt` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `sys_role_uid` varchar(40) DEFAULT NULL COMMENT '角色表uid',
  `sys_table_uid` varchar(40) DEFAULT NULL COMMENT '操作表uid',
  `createtime` varchar(40) DEFAULT NULL COMMENT '创建时间',
  `updatetime` varchar(40) DEFAULT NULL COMMENT '更新时间',
  `updateuid` varchar(40) DEFAULT NULL COMMENT '更新用户uid',
  PRIMARY KEY (`id`),
  KEY `fk_role_table_uid1` (`sys_role_uid`) USING BTREE,
  KEY `fk_role_table_uid2` (`sys_table_uid`) USING BTREE,
  CONSTRAINT `fk_role_table_uid1` FOREIGN KEY (`sys_role_uid`) REFERENCES `sys_role_info` (`sys_role_uid`),
  CONSTRAINT `fk_role_table_uid2` FOREIGN KEY (`sys_table_uid`) REFERENCES `sys_oprt_table` (`sys_table_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

/*Data for the table `sys_role_oprt` */

insert  into `sys_role_oprt`(`id`,`sys_role_uid`,`sys_table_uid`,`createtime`,`updatetime`,`updateuid`) values 
(47,'14882759478049743','14883499177574407','2017-03-03 18:09:02','2017-03-03 18:09:02',NULL),
(48,'14882759478049743','14883499622707927','2017-03-03 18:09:03','2017-03-03 18:09:03',NULL),
(49,'14882759478049744','14883739279149299','2017-03-03 18:09:06','2017-03-03 18:09:06',NULL);

/*Table structure for table `sys_role_resource` */

DROP TABLE IF EXISTS `sys_role_resource`;

CREATE TABLE `sys_role_resource` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `sys_role_uid` varchar(40) DEFAULT NULL COMMENT '用户表uid',
  `sys_resource_uid` varchar(40) DEFAULT NULL COMMENT '资源表uid',
  `createtime` varchar(40) DEFAULT NULL COMMENT '创建时间',
  `updatetime` varchar(40) DEFAULT NULL COMMENT '更新时间',
  `updateuid` varchar(40) DEFAULT NULL COMMENT '更新用户uid',
  PRIMARY KEY (`id`),
  KEY `fk_role_resource1` (`sys_role_uid`),
  KEY `fk_role_resource2` (`sys_resource_uid`),
  CONSTRAINT `fk_role_resource1` FOREIGN KEY (`sys_role_uid`) REFERENCES `sys_role_info` (`sys_role_uid`),
  CONSTRAINT `fk_role_resource2` FOREIGN KEY (`sys_resource_uid`) REFERENCES `sys_resource_info` (`sys_resource_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=391 DEFAULT CHARSET=utf8;

/*Data for the table `sys_role_resource` */

insert  into `sys_role_resource`(`id`,`sys_role_uid`,`sys_resource_uid`,`createtime`,`updatetime`,`updateuid`) values 
(374,'14882759478049742','14862759478049744',NULL,NULL,NULL),
(375,'14882759478049742','14862759478049741',NULL,NULL,NULL),
(376,'14882759478049742','14862759478049742',NULL,NULL,NULL),
(377,'14882759478049742','14862759478049743',NULL,NULL,NULL),
(378,'14882759478049742','14862759478049747',NULL,NULL,NULL),
(379,'14882759478049742','14862759478049745',NULL,NULL,NULL),
(380,'14882759478049742','14862759478049746',NULL,NULL,NULL),
(381,'14882759478049742','14887012437361812',NULL,NULL,NULL),
(382,'14882759478049742','14887012777071188',NULL,NULL,NULL),
(383,'14882759478049742','14888881262858705',NULL,NULL,NULL),
(384,'14882759478049742','14888881635729582',NULL,NULL,NULL),
(385,'14882759478049743','14862759478049744',NULL,NULL,NULL),
(386,'14882759478049743','14862759478049741',NULL,NULL,NULL),
(387,'14882759478049743','14862759478049742',NULL,NULL,NULL),
(388,'14882759478049743','14862759478049743',NULL,NULL,NULL),
(389,'14882759478049744','14888881262858705',NULL,NULL,NULL),
(390,'14882759478049744','14888881635729582',NULL,NULL,NULL);

/*Table structure for table `sys_user_info` */

DROP TABLE IF EXISTS `sys_user_info`;

CREATE TABLE `sys_user_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `sys_user_uid` varchar(40) DEFAULT NULL COMMENT '唯一键，关联键',
  `sys_username` varchar(20) DEFAULT NULL COMMENT '用户名',
  `sys_pwd` varchar(255) DEFAULT NULL COMMENT '密码',
  `sys_name` varchar(20) DEFAULT NULL COMMENT '姓名',
  `sys_birth` varchar(20) DEFAULT NULL COMMENT '出生年月',
  `sys_sex` varchar(4) DEFAULT NULL COMMENT '性别',
  `sys_cert_type` varchar(10) DEFAULT NULL COMMENT '证件类型',
  `sys_cert_val` varchar(30) DEFAULT NULL COMMENT '证件信息',
  `sys_user_prov` varchar(40) DEFAULT NULL COMMENT 'Area的uid',
  `sys_prov_name` varchar(60) DEFAULT NULL COMMENT '省名称(冗余)',
  `sys_user_city` varchar(40) DEFAULT NULL COMMENT '市',
  `sys_city_name` varchar(60) DEFAULT NULL COMMENT '市名称(冗余)',
  `sys_user_img` varchar(128) DEFAULT NULL COMMENT '用户头像地址前缀，图片加1.jpg,2.jpg',
  `sys_img_count` int(11) DEFAULT NULL COMMENT '头像张数',
  `createtime` varchar(40) DEFAULT NULL COMMENT '创建时间',
  `updatetime` varchar(40) DEFAULT NULL COMMENT '更新时间',
  `updateuid` varchar(40) DEFAULT NULL COMMENT '更新用户uid',
  `del_status` bit(1) DEFAULT b'0' COMMENT '删除状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sys_username` (`sys_username`),
  KEY `sys_user_uid` (`sys_user_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

/*Data for the table `sys_user_info` */

insert  into `sys_user_info`(`id`,`sys_user_uid`,`sys_username`,`sys_pwd`,`sys_name`,`sys_birth`,`sys_sex`,`sys_cert_type`,`sys_cert_val`,`sys_user_prov`,`sys_prov_name`,`sys_user_city`,`sys_city_name`,`sys_user_img`,`sys_img_count`,`createtime`,`updatetime`,`updateuid`,`del_status`) values 
(4,'14882759478049746','01139932','000000','吴乔','1990.10.01','男','工号','01139932','AreaId','广东','深圳','深圳市冗余','1.jpg,2.jpg',12,'2017-02-28 59:17:07','2017-03-08 19:46:36','01139932','\0'),
(5,'14882772014251766','123','123','test','1990.1.01','女','身份证','420984199011253256','Area','湖北','孝感','汉川','url',11,'2017-02-28 18:20:01','2017-03-01 13:54:36',NULL,'\0'),
(7,'14886916711141497','admin','admin','admin','1899-12-02','女','工号','0001','1','广东','深圳','t','11',11,'2017-03-05 13:27:51','2017-03-09 16:45:24','01139932','\0');

/*Table structure for table `sys_user_role` */

DROP TABLE IF EXISTS `sys_user_role`;

CREATE TABLE `sys_user_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `sys_user_uid` varchar(40) DEFAULT NULL COMMENT '用户表uid',
  `sys_role_uid` varchar(40) DEFAULT NULL COMMENT '角色表uid',
  `createtime` varchar(40) DEFAULT NULL COMMENT '创建时间',
  `updatetime` varchar(40) DEFAULT NULL COMMENT '更新时间',
  `updateuid` varchar(40) DEFAULT NULL COMMENT '更新用户uid',
  PRIMARY KEY (`id`),
  KEY `fk_user_role_uid1` (`sys_role_uid`),
  KEY `fk_user_role_uid2` (`sys_user_uid`),
  CONSTRAINT `fk_user_role_uid1` FOREIGN KEY (`sys_role_uid`) REFERENCES `sys_role_info` (`sys_role_uid`),
  CONSTRAINT `fk_user_role_uid2` FOREIGN KEY (`sys_user_uid`) REFERENCES `sys_user_info` (`sys_user_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8;

/*Data for the table `sys_user_role` */

insert  into `sys_user_role`(`id`,`sys_user_uid`,`sys_role_uid`,`createtime`,`updatetime`,`updateuid`) values 
(54,'14882772014251766','14882759478049744','2017-03-03 16:38:17','2017-03-03 16:38:17',NULL),
(73,'14882772014251766','14882759478049743','2017-03-06 15:52:21','2017-03-06 15:52:21',NULL),
(83,'14882759478049746','14882759478049744','2017-03-06 16:16:21','2017-03-06 16:16:21',NULL),
(87,'14882759478049746','14882759478049743','2017-03-06 20:32:33','2017-03-06 20:32:33',NULL),
(93,'14882759478049746','14882759478049742','2017-03-10 10:05:31','2017-03-10 10:05:31',NULL),
(113,'14886916711141497','14882759478049742','2017-03-10 10:29:56','2017-03-10 10:29:56',NULL),
(114,'14886916711141497','14882759478049743','2017-03-10 10:29:57','2017-03-10 10:29:57',NULL),
(115,'14886916711141497','14882759478049744','2017-03-10 10:29:57','2017-03-10 10:29:57',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
