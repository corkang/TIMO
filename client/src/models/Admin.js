import { Axios } from '../lib/axios';

export default class Admin {
  static getDashboard = async () => await Axios().get('/admin/dashboard');
}
