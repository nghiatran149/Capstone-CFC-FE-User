import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Avatar, Dropdown, List, Typography, Tag, Space, Divider, Button, Select, Empty } from 'antd';
import { BellOutlined, UserOutlined, CheckOutlined } from '@ant-design/icons';
import classNames from 'classnames';

const { Text, Title } = Typography;
const { Option } = Select;

// Format time helper function
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'Vừa xong';
  } else if (diffMin < 60) {
    return `${diffMin} phút trước`;
  } else if (diffHour < 24) {
    return `${diffHour} giờ trước`;
  } else if (diffDay < 7) {
    return `${diffDay} ngày trước`;
  } else {
    return date.toLocaleDateString('vi-VN');
  }
};

// Status filter options
const statusOptions = [
  { value: 'all', label: 'All Notification' },
  { value: 'new', label: 'New' },
  { value: 'unread', label: 'Unread' },
  { value: 'other', label: 'Other' }
];

const NotificationItem = ({ notification, onClick }) => {
  const getTagColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'blue';
      case 'urgent':
        return 'red';
      case 'processing':
        return 'orange';
      case 'completed':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <List.Item 
      className="cursor-pointer hover:bg-pink-50 transition-colors duration-300"
      onClick={() => onClick(notification)}
    >
      <div className="flex w-full">
        <div className="mr-3">
          <Avatar icon={<UserOutlined />} className="bg-pink-500" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-1">
            <Text strong>{notification.type || "Thông báo"}</Text>
            <Text type="secondary" className="text-xs">
              {formatTime(notification.createAt)}
            </Text>
          </div>
          <Text className="block mb-2">{notification.message}</Text>
          <div className="flex flex-wrap gap-2">
            {!notification.isRead && (
              <Tag color="red">Unread</Tag>
            )}
            <Tag color={getTagColor(notification.status)}>
              {notification.status || "New"}
            </Tag>
          </div>
        </div>
      </div>
    </List.Item>
  );
};

const NotificationSection = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  
  // Mock data for demonstration
  useEffect(() => {
    const mockNotifications = [
      {
        notiId: '1',
        message: 'Đơn hàng #12345 đã được xác nhận và đang được xử lý',
        type: 'Order',
        relatedId: '12345',
        createAt: new Date(Date.now() - 1000 * 60 * 5),
        isRead: false,
        status: 'New'
      },
      {
        notiId: '2',
        message: 'Sản phẩm "Bó hoa tulip" đã được cập nhật giá mới',
        type: 'Product',
        relatedId: '8754',
        createAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        isRead: true,
        status: 'Updated'
      },
      {
        notiId: '3',
        message: 'Khuyến mãi "Mùa thu vàng" sẽ kết thúc trong 2 ngày tới',
        type: 'Promotion',
        relatedId: '5421',
        createAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: false,
        status: 'Urgent'
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.notiId);
    }
    
    setOpen(false);
    
    // Handle navigation based on notification type
    if (notification.relatedId) {
      switch (notification.type) {
        case 'Order':
          navigate(`/orders/${notification.relatedId}`);
          break;
        case 'Product':
          navigate(`/products/${notification.relatedId}`);
          break;
        case 'Promotion':
          navigate(`/promotions/${notification.relatedId}`);
          break;
        default:
          console.log('Notification clicked:', notification);
          break;
      }
    }
  };

  // Mark as read
  const markAsRead = (notiId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.notiId === notiId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
    
    setUnreadCount(0);
  };

  // Filter Notifications
  const filteredNotifications = useMemo(() => {
    switch (value) {
      case 'new':
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        return notifications.filter(notification => new Date(notification.createAt) > oneDayAgo);
        
      case 'unread':
        return notifications.filter(notification => !notification.isRead);
        
      case 'other':
        const oneDayAgoForOther = new Date();
        oneDayAgoForOther.setDate(oneDayAgoForOther.getDate() - 1);
        return notifications.filter(notification =>
          new Date(notification.createAt) <= oneDayAgoForOther && notification.isRead
        );
        
      case 'all':
      default:
        return notifications;
    }
  }, [value, notifications]);

  // Dropdown Content
  const menu = (
    <div className="bg-white rounded-lg shadow-lg w-80 max-h-98 overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Title level={5} className="m-0">Notification</Title>
          {unreadCount > 0 && (
            <Badge count={unreadCount} className="ml-2 mb-2" />
          )}
        </div>
        <Button 
          type="text" 
          className="text-pink-500 hover:text-pink-700"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <Space>
            <CheckOutlined />
            <span>Mark all as read</span>
          </Space>
        </Button>
      </div>
      
      <div className="p-3 border-b border-gray-100">
        <Select
          className="w-full"
          value={value}
          onChange={setValue}
          options={statusOptions}
        />
      </div>
      
      <div className="overflow-y-auto pl-4 pr-2 max-h-64">
        {filteredNotifications.length > 0 ? (
          <List
            dataSource={filteredNotifications}
            renderItem={(item) => (
              <NotificationItem 
                notification={item} 
                onClick={handleNotificationClick}
              />
            )}
            split={true}
          />
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="Không có thông báo" 
            className="py-8" 
          />
        )}
      </div>
      
      <div className="p-2 border-t border-gray-100 text-center">
        <Button type="link">View all</Button>
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      arrow
      overlayClassName="shadow-2xl"
    >
      <div className="cursor-pointer p-1">
        <Badge count={unreadCount} overflowCount={99}>
        <BellOutlined className="text-2xl text-gray-600 hover:text-pink-500" />
          {/* <Avatar
            className={classNames(
              "flex items-center justify-center transition-all duration-300",
              open ? "bg-pink-300 text-white" : "bg-pink-100 text-blue-600 hover:bg-blue-200"
            )}
            icon={<BellOutlined className="text-2xl text-gray-600" />}
            size="large"
          /> */}
        </Badge>
      </div>
    </Dropdown>
  );
};

export default NotificationSection;